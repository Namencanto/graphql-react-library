const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
} = require("graphql");
const db = require("../../config/db.js");
const UserType = require("../types/userType.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Joi = require("joi");
const { GraphQLObjectType } = require("graphql");

const userSchema = Joi.object({
  login: Joi.string().alphanum().min(3).max(30).required(),
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)",
    }),
  admin: Joi.boolean().required(),
});

const userSchemaEdit = Joi.object({
  login: Joi.string().alphanum().min(3).max(30).optional(),
  name: Joi.string().min(3).max(30).optional(),
  newPassword: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
    .optional()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)",
    }),
});

const userMutations = {
  fields: {
    // Add a user
    addUser: {
      type: UserType,
      args: {
        login: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        admin: { type: GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(parent, { login, name, password, admin }) {
        // Validate user input
        const { error } = userSchema.validate({ login, name, password, admin });
        if (error) {
          throw new Error(error.message);
        }

        // Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Check if user already exists
        const existingUser = await db.query(
          "SELECT * FROM library.users WHERE login = $1",
          [login]
        );
        if (existingUser.rows.length > 0) {
          throw new Error("User already exists");
        }

        // Creating new user in pg db
        const userQuery = {
          text: "INSERT INTO library.users(login, name, password, admin) VALUES($1, $2, $3, $4) RETURNING *",
          values: [login, name, hash, admin],
        };
        const { rows } = await db.query(userQuery);

        // Return new user
        return rows[0];
      },
    },

    // Login mutation
    loginUser: {
      type: new GraphQLObjectType({
        name: "UserLogin",
        fields: () => ({
          id: { type: GraphQLID },
          name: { type: GraphQLString },
          admin: { type: GraphQLBoolean },
        }),
      }),
      args: {
        login: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        admin: { type: GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(parent, { login, password, admin }, context) {
        // Check if user exists in the database
        const { rows } = await db.query(
          "SELECT * FROM library.users WHERE login = $1",
          [login]
        );
        const user = rows[0];
        if (!user) {
          throw new Error("Invalid login credentials");
        }
        if (user.admin !== admin) {
          throw new Error(
            `Please login through ${admin ? "user" : "admin"} panel`
          );
        }

        // Check if password is correct
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid login credentials");
        }
        // Generate a JWT token
        const token = jwt.sign(
          { name: user.name, userId: user.id, isAdmin: user.admin },
          process.env.JWT_SECRET
        );

        // Save token to cookie
        context.res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        return {
          id: user.id,
          name: user.name,
          admin: user.admin,
        };
      },
    },

    // Update a user
    updateUser: {
      type: UserType,
      args: {
        login: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLNonNull(GraphQLString) },
        newPassword: { type: GraphQLString },
      },
      async resolve(parent, { login, name, password, newPassword }, context) {
        // Validate credentials
        if (login.length === 0 && name.length === 0 && newPassword.length === 0)
          throw new Error("At least one field must be provided to update");

        const { error } = userSchemaEdit.validate({
          login: login.length > 0 ? login : undefined,
          name: name.length > 0 ? name : undefined,
          newPassword: newPassword.length > 0 ? newPassword : undefined,
        });
        if (error) {
          throw new Error(error.message);
        }

        // Check if user is authenticated
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        // Check if user exists
        const res = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );

        const user = res.rows[0];

        if (user.length === 0) {
          throw new Error("User not found");
        }
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
          throw new Error("Invalid login credentials");
        }

        // Hash the new password if provided
        let hash;
        if (newPassword) {
          const salt = bcrypt.genSaltSync(10);
          hash = bcrypt.hashSync(newPassword, salt);
        }

        // Update the user in the database
        const userQuery = {
          text: "UPDATE library.users SET login = COALESCE($1, login), name = COALESCE($2, name), password = COALESCE($3, password) WHERE id = $4 RETURNING *",
          values: [login, name, hash || user.password, userId],
        };
        const { rows } = await db.query(userQuery);

        // Return updated user
        return rows[0];
      },
    },

    // Delete a user
    deleteUser: {
      type: UserType,
      args: {
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { password }, context) {
        // Check if user is authenticated
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        // Check if user exists
        const res = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );

        const user = res.rows[0];

        if (user.length === 0) {
          throw new Error("User not found");
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
          throw new Error("Invalid password");
        }
        // Delete user
        await db.query("DELETE FROM library.users WHERE id = $1 RETURNING *", [
          userId,
        ]);

        // Update all books borrowed by the user being deleted
        await db.query(
          "UPDATE library.books SET borrowed_by = 0 WHERE borrowed_by = $1",
          [userId]
        );

        return "Successfully deleted account";
      },
    },

    // Logout a user by clearing their session cookie
    logout: {
      type: GraphQLString,
      resolve(parent, args, { res }) {
        res.clearCookie("jwt");
        return "Logged out successfully";
      },
    },
  },
};

module.exports = userMutations;
