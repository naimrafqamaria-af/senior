require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
app.use(cors());
app.use(express.json());
app.use("/uploads",
  express.static("uploads")
);

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
//he lel add pic for pp
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try {

      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        });
      }

      res.json({
        imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      });

    } catch (error) {

      console.log("UPLOAD ERROR:", error);

      res.status(500).json({
        message: "Upload failed"
      });
    }
  }
);


//creating transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Connect Database

 db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("MySQL Connected ✅");
  }
});


// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// =====================================
// REGISTER API
// =====================================


app.post("/register", async (req, res) => {

  const {
    name,
    email,
    password,
    role,
  } = req.body;

  // Prevent fake admins
  if (role === "admin") {

    return res.status(403).json({
      message: "Cannot register as admin",
    });

  }

  try {

    // Check if email already exists
    const checkSql = `
      SELECT * FROM users
      WHERE email = ?
    `;

    db.query(checkSql, [email], async (checkErr, checkResult) => {

      if (checkErr) {

        console.log(checkErr);

        return res.status(500).json({
          message: "Server error",
        });

      }

      if (checkResult.length > 0) {

        return res.status(400).json({
          message: "Email already exists",
        });

      }

      // Encrypt password
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // Create verification token
      const verificationToken =
        crypto.randomBytes(32).toString("hex");

      // Insert user
      const sql = `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          is_verified,
          verification_token
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          name,
          email,
          hashedPassword,
          role,
          0,
          verificationToken,
        ],
        async (err, result) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              message: "Registration failed",
            });

          }

          // Verification link
          const verificationLink =
            `http://localhost:5000/verify/${verificationToken}`;

          try {

            // Send email
            await transporter.sendMail({

              from: process.env.EMAIL_USER,

              to: email,

              subject: "Verify your Study2Work account",

              html: `
                <h2>Welcome to Study2Work 🚀</h2>

                <p>
                  Please click the button below
                  to verify your account:
                </p>

                <a
                  href="${verificationLink}"
                  style="
                    background: teal;
                    color: white;
                    padding: 12px 20px;
                    text-decoration: none;
                    border-radius: 8px;
                    display: inline-block;
                  "
                >
                  Verify Account
                </a>
              `,
            });

            res.status(201).json({

              message:
                "Registration successful ✅ Please verify your email.",

              user: {
                id: result.insertId,
                name,
                email,
                role,
              },

            });

          } catch (mailError) {

            console.log(mailError);

            res.status(500).json({
              message: "Failed to send verification email",
            });

          }

        }
      );

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});


// =====================================
// VERIFY EMAIL
// =====================================

app.get("/verify/:token", (req, res) => {

  const { token } = req.params;

  const sql = `
    UPDATE users
    SET
      is_verified = 1,
      verification_token = NULL
    WHERE verification_token = ?
  `;

  db.query(sql, [token], (err, result) => {

    if (err) {

      console.log(err);

      return res.send("Verification failed");

    }

    if (result.affectedRows === 0) {

      return res.send(
        "Invalid or expired verification link"
      );

    }

    res.send(`
      <h1>
        Account verified successfully ✅
      </h1>

      <p>
        You can now login to Study2Work.
      </p>
    `);

  });

});
// =====================================
// LOGIN API
// =====================================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Login error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result[0];

    if (user.is_verified === 0) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    delete user.password;
    delete user.verification_token;

    res.json({
      message: "Login successful ✅",
      user: user,
    });
  });
});


// =====================================
// POST JOB API
// =====================================

app.post("/jobs", (req, res) => {

  const {
    title,
    description,
    budget,
    category,
    location,
    image,
    client_id,
  } = req.body;


  const sql = `
    INSERT INTO jobs
    (title, description, budget, category, location, image, client_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(
    sql,
    [
      title,
      description,
      budget,
      category,
      location,
      image,
      client_id,
    ],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Failed to post job",
        });
      }

      res.status(201).json({
        message: "Job posted successfully ✅",
      });
    }
  );
});


// =====================================
// GET ALL JOBS API
// =====================================

app.get("/jobs", (req, res) => {

  const sql = 'SELECT * FROM jobs ORDER BY id DESC';

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Failed to fetch jobs",
      });
    }

    res.json(result);
  });
});

// =====================================
// GET CLIENT JOBS
// =====================================

app.get("/client-jobs/:clientId", (req, res) => {

  const { clientId } = req.params;

  const sql = `
    SELECT *
    FROM jobs
    WHERE client_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [clientId], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch jobs",
      });

    }

    res.json(result);

  });

});

// =====================================
// APPLY FOR JOB API
// =====================================
app.post("/apply", (req, res) => {

  const { student_id, job_id, message } = req.body;

  // 1. Check if already applied
  const checkSql = `
    SELECT * FROM applications
    WHERE student_id = ? AND job_id = ?
  `;

  db.query(checkSql, [student_id, job_id], (err, result) => {

    if (err) {
      return res.status(500).json({ message: "Error checking application" });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Already applied"
      });
    }

    // 2. Insert new application
    const sql = `
      INSERT INTO applications (student_id, job_id, message)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [student_id, job_id, message], (err2) => {

      if (err2) {
        return res.status(500).json({ message: "Application failed" });
      }

      res.status(201).json({
        message: "Applied successfully"
      });
    });
  });
});
//get student app
app.get("/my-applications/:studentId", (req, res) => {

  const { studentId } = req.params;

const sql = `
 SELECT
  applications.job_id,
  applications.id,
  applications.status,
  jobs.title,
  jobs.description,
  jobs.category,
  jobs.location,
  jobs.budget,
  jobs.image

FROM applications

JOIN jobs
ON applications.job_id = jobs.id

WHERE applications.student_id = ?

ORDER BY applications.id DESC
`;

  db.query(sql, [studentId], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch applications",
      });
    }

    res.json(result);
  });
});

// =====================================
// CLIENT APPLICATIONS API
// =====================================

app.get("/client-applications/:clientId", (req, res) => {

  const { clientId } = req.params;

 const sql = `
  SELECT
    applications.id,
    applications.student_id,
    applications.message,
    applications.status,
    users.name AS student_name,
    users.email AS student_email,
    jobs.title AS job_title,
    jobs.category,
    jobs.budget
  FROM applications

  JOIN jobs
  ON applications.job_id = jobs.id

  JOIN users
  ON applications.student_id = users.id

  WHERE jobs.client_id = ?

  ORDER BY applications.id DESC
`;

  db.query(sql, [clientId], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch applications",
      });
    }

    res.json(result);
  });
});
// =====================================
// ACCEPT APPLICATION
// ==============================

app.put("/accept-application/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT
      applications.id,
      applications.status,
      users.name AS student_name,
      users.email AS student_email,
      jobs.title AS job_title
    FROM applications

    JOIN users
    ON applications.student_id = users.id

    JOIN jobs
    ON applications.job_id = jobs.id

    WHERE applications.id = ?
  `;

  db.query(sql, [id], async (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Server error",
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "Application not found",
      });

    }

    const application = result[0];
    if (application.status !== "pending") {

  return res.status(400).json({
    message: "Application has already been processed",
  });

}

    // Update status
    const updateSql = `
      UPDATE applications
      SET status = 'Accepted'
      WHERE id = ?
    `;

    db.query(updateSql, [id], async (err2) => {

      if (err2) {

        console.log(err2);

        return res.status(500).json({
          message: "Failed to accept application",
        });

      }

      // Send email
      try {

        await transporter.sendMail({

          from: process.env.EMAIL_USER,

          to: application.student_email,

          subject: "Application Accepted ✅",

          html: `
            <h2>Hello ${application.student_name}</h2>

            <p>
              Congratulations 🎉
            </p>

            <p>
              Your application for:
              <strong>${application.job_title}</strong>
              has been accepted.
            </p>

            <p>
              The client may contact you soon.
            </p>
          `,

        });

      } catch (mailError) {

        console.log(mailError);

      }

      res.json({
        message: "Application accepted and email sent ✅",
      });

    });

  });

});


// =====================================
// REJECT APPLICATION
// =====================================

app.put("/reject-application/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT
      applications.id,
      applications.status,
      users.name AS student_name,
      users.email AS student_email,
      jobs.title AS job_title
    FROM applications

    JOIN users
    ON applications.student_id = users.id

    JOIN jobs
    ON applications.job_id = jobs.id

    WHERE applications.id = ?
  `;

  db.query(sql, [id], async (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Server error",
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "Application not found",
      });

    }

    const application = result[0];
    if (application.status !== "pending") {

  return res.status(400).json({
    message: "Application has already been processed",
  });

}

    // Update status
    const updateSql = `
      UPDATE applications
      SET status = 'Rejected'
      WHERE id = ?
    `;

    db.query(updateSql, [id], async (err2) => {

      if (err2) {

        console.log(err2);

        return res.status(500).json({
          message: "Failed to reject application",
        });

      }

      // Send email
      try {

        await transporter.sendMail({

          from: process.env.EMAIL_USER,

          to: application.student_email,

          subject: "Application Update",

          html: `
            <h2>Hello ${application.student_name}</h2>

            <p>
              Thank you for applying for:
              <strong>${application.job_title}</strong>
            </p>

            <p>
              Unfortunately, your application
              was not selected this time.
            </p>

            <p>
              We wish you success in future opportunities 🍀
            </p>
          `,

        });

      } catch (mailError) {

        console.log(mailError);

      }

      res.json({
        message: "Application rejected and email sent ✅",
      });

    });

  });

});

// =====================================
// CHANGE PASSWORD API
// =====================================

app.put("/change-password", (req, res) => {

  const {
    userId,
    oldPassword,
    newPassword,
  } = req.body;

  // Check old password
  const checkSql = `
    SELECT * FROM users
    WHERE id = ? AND password = ?
  `;

  db.query(
    checkSql,
    [userId, oldPassword],
    (err, result) => {

      if (err) {

        return res.status(500).json({
          message: "Server error",
        });
      }

      if (result.length === 0) {

        return res.status(401).json({
          message: "Old password is incorrect",
        });
      }
 // UPDATE USER PROFILE
app.put("/users/:id", (req, res) => {

  const { id } = req.params;

  const {
    name,
    email,
    profile_photo,
    bio,
    skills,
    university,
    location,
    phone,
    portfolio,
  } = req.body;

  const sql = `
    UPDATE users
    SET
      name = ?,
      email = ?,
      profile_photo = ?,
      bio = ?,
      skills = ?,
      university = ?,
      location = ?,
      phone = ?,
      portfolio = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      email,
      profile_photo,
      bio,
      skills,
      university,
      location,
      phone,
      portfolio,
      id,
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Failed to update profile",
        });
      }

      res.json({
        message: "Profile updated successfully",
      });
    }
  );
});
      // Update password
      const updateSql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [newPassword, userId],
        (err2) => {

          if (err2) {

            return res.status(500).json({
              message: "Failed to update password",
            });
          }

          res.json({
            message: "Password updated successfully ✅",
          });
        }
      );
    }
  );
});


// =====================================
// UPDATE PROFILE API
// =====================================

app.put("/users/:id", (req, res) => {

  const { id } = req.params;

  const {
    name,
    email,
    profile_photo,
    location,
    gender,
    phone,
    university,
    skills,
    past_works,
    marital_status,
    children_count,
  } = req.body;

  const sql = `
    UPDATE users
    SET
      name = ?,
      email = ?,
      profile_photo = ?,
      location = ?,
      gender = ?,
      phone = ?,
      university = ?,
      skills = ?,
      past_works = ?,
      marital_status = ?,
      children_count = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      email,
      profile_photo,
      location,
      gender,
      phone,
      university,
      skills,
      past_works,
      marital_status,
      children_count,
      id,
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Failed to update profile",
        });
      }

      res.json({
        message: "Profile updated successfully ✅",
      });
    }
  );
});
// =====================================
// TOTAL USERS API
// =====================================

app.get("/total-users", (req, res) => {

  const sql =
    "SELECT COUNT(*) AS total FROM users";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error fetching users",
      });

    }

    res.json(result[0]);

  });

});
 // =====================================
// GET SINGLE USER PROFILE
// =====================================

app.get("/user/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT * FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch profile",
      });

    }

    if (result.length === 0) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    res.json(result[0]);

  });

});
// =====================================
// TOTAL APPLICATIONS API
// =====================================

app.get("/total-applications", (req, res) => {

  const sql =
    "SELECT COUNT(*) AS total FROM applications";

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Error fetching applications",
      });

    }

    res.json(result[0]);

  });

});


//delete jobs 
// =====================================
// DELETE JOB
// =====================================

app.delete("/jobs/:id", (req, res) => {

  const { id } = req.params;
  const { userId, role } = req.body;

  // ADMIN CAN DELETE ANYTHING
  if (role === "admin") {

    db.query(
      "DELETE FROM jobs WHERE id = ?",
      [id],
      (err) => {

        if (err) {

          return res.status(500).json({
            message: "Delete failed",
          });

        }

        return res.json({
          message: "Job deleted successfully",
        });

      }
    );

    return;
  }

  // CLIENT CAN DELETE ONLY HIS JOB
  const sql = `
    DELETE FROM jobs
    WHERE id = ?
    AND client_id = ?
  `;

  db.query(sql, [id, userId], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Delete failed",
      });

    }

    if (result.affectedRows === 0) {

      return res.status(403).json({
        message: "Not authorized",
      });

    }

    res.json({
      message: "Job deleted successfully ✅",
    });

  });

});
// =====================================
// GET ALL USERS API
// =====================================

app.get("/users", (req, res) => {

  const sql = `
    SELECT id, name, email, role
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to fetch users",
      });

    }

    res.json(result);

  });

});

// =====================================
// DELETE USER API
// =====================================

app.delete("/users/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to delete user",
      });

    }

    res.json({
      message: "User deleted successfully",
    });

  });

});

// =====================================
// ADD REVIEW API
// =====================================

app.post("/reviews", (req, res) => {

  const {
    user_id,
    user_name,
    role,
    rating,
    comment,
  } = req.body;

  const sql = `
    INSERT INTO reviews
    (user_id, user_name, role, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      user_name,
      role,
      rating,
      comment,
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: "Failed to submit review",
        });
      }

      res.json({
        message: "Review submitted ✅",
      });
    }
  );
});


// =====================================
// GET REVIEWS API
// =====================================

app.get("/reviews", (req, res) => {

  const sql = `
    SELECT * FROM reviews
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      return res.status(500).json({
        message: "Failed to fetch reviews",
      });
    }

    res.json(result);
  });
});

// SAVE JOB
app.post("/save-job", (req, res) => {
  const { student_id, job_id } = req.body;

  const sql = `
    INSERT INTO saved_jobs (student_id, job_id)
    VALUES (?, ?)
  `;

  db.query(sql, [student_id, job_id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to save job",
      });
    }
    

    res.json({
      message: "Job saved successfully",
    });
  });
});


// GET SAVED JOBS
app.get("/saved-jobs/:studentId", (req, res) => {

  const { studentId } = req.params;

  const sql = `
    SELECT jobs.*
    FROM saved_jobs
    JOIN jobs
    ON saved_jobs.job_id = jobs.id
    WHERE saved_jobs.student_id = ?
  `;

  db.query(sql, [studentId], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Failed",
      });
    }

    res.json(result);

  });

});

// =====================================
// SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}

);