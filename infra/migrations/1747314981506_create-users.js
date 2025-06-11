exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: {
      // for reference github uses varchar(39)
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      // for reference the maximum length of an email address is 254 characters
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      // for reference bcrypt hashes are 72 characters long
      type: "varchar(72)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
