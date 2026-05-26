const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
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
  host: "localhost",
  user: "root",
  password: "",
  database: "study2work",
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

    res.json({
      imageUrl:
       ` http://localhost:5000/uploads/${req.file.filename}`,
    });
  }
);


//creating transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "study2work@gmail.com",
    pass: "Study2work@pass",
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

app.post("/register", (req, res) => {

  const { name, email, password, role } = req.body;

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password, role],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Registration failed",
        });
      }

      res.status(201).json({
        message: "User registered successfully ✅",
        user: [result.insertId, name, email, role]
      });
    }
  );
});


// =====================================
// LOGIN API
// =====================================

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Login error",
      });
    }

    if (result.length > 0) {

      res.json({
        message: "Login successful ✅",
        user: result[0],
      });

    } else {

      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  });
});

// CREATE INTERVIEW
app.post("/interviews", (req, res) => {

  const {
    application_id,
    interview_date,
    meeting_link,
  } = req.body;

  const sql = `
    INSERT INTO interviews
    (application_id, interview_date, meeting_link)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [
      application_id,
      interview_date,
      meeting_link,
    ],
    (err) => {

      if (err) {

        return res.status(500).json({
          message: "Failed",
        });
      }

      res.json({
        message: "Interview scheduled ✅",
      });
    }
  );
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
  jobs.title,
  jobs.description,
  jobs.category,
  jobs.location,
  jobs.budget,
  jobs.image
FROM applications
JOIN jobs ON applications.job_id = jobs.id
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

  const sql =
    "UPDATE applications SET status='Accepted' WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to accept application",
      });
    }

    res.json({
      message: "Application accepted ✅",
    });
  });
});


// =====================================
// REJECT APPLICATION
// =====================================

app.put("/reject-application/:id", (req, res) => {

  const { id } = req.params;

  const sql =
    "UPDATE applications SET status='Rejected' WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {

      console.log(err);

      return res.status(500).json({
        message: "Failed to reject application",
      });
    }

    res.json({
      message: "Application rejected ❌",
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
  } = req.body;

  const sql = `
    UPDATE users
    SET
      name = ?,
      email = ?,
      profile_photo = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      email,
      profile_photo,
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
        message: "Profile updated",
      });
    }
  );
});

// SAVE JOB
app.post("/save-job", (req, res) => {

  const { student_id, job_id } = req.body;

  const sql = `
    INSERT INTO saved_jobs
    (student_id, job_id)
    VALUES (?, ?)
  `;

  db.query(sql, [student_id, job_id], (err) => {

    if (err) {
      return res.status(500).json({
        message: "Failed to save job",
      });
    }

    res.json({
      message: "Job saved ✅",
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
app.delete("/jobs/:id", (req, res) => {

  const role = req.headers.role;

  if (role !== "admin") {

    return res.status(403).json({
      message: "Access denied",
    });

  }

  const { id } = req.params;

  const sql = `
    DELETE FROM jobs
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {

      return res.status(500).json({
        message: "Delete failed",
      });

    }

    res.json({
      message: "Job deleted successfully",
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
// =====================================
// SERVER
// =====================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
}

);