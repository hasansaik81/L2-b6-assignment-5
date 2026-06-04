# SkillBridge 🎓 - Expert Tutor Booking Platform

 vercel_live_link=https://skillbridge-server-gold.vercel.app/
 github:https://github.com/hasansaik81/L2-b6-skillbridge4-server


SkillBridge is a full-stack web application built to seamlessly connect learners with expert tutors. Students can discover top tutors, view schedules, and book instantly. Tutors gain full control over their availability and bookings, while Admins ensure platform security and moderate content.

---

##  Features

### Public Features
- **Smart Search & Filter:** Browse tutors by subject, rating, price, and category.
- **Detailed Profiles:** View tutor bios, experience, hourly rates, and verified reviews.
- **Dynamic Landing Page:** Spotlights featured and top-rated tutors.

### Student Features
- Secure registration and role-based login (`STUDENT`).
- Instant booking system for available tutor slots.
- Personal Dashboard to track upcoming and past sessions.
- Review system to rate and share feedback after completed sessions.

### Tutor Features
- Secure registration and onboarding (`TUTOR`).
- Profile Management (Bio, Experience, Hourly rate, Subject categories).
- **Availability Matrix:** Set customized dynamic time slots.
- Session tracker to view earnings and manage student sessions.

### Admin Features
- Comprehensive User Management (View, ban, or unban students/tutors).
- Global Booking Tracker to oversee all platform transactions.
- Category Management (Add/Edit tutoring subjects).

---

##  Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js / Next.js API Routes
- **Database:** PostgreSQL (Hosted on Supabase/Neon)
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing

---

##  Database Schema Overview

The database uses PostgreSQL managed by Prisma ORM. Key tables include:
- `User`: Core account and auth details (Roles: STUDENT, TUTOR, ADMIN).
- `TutorProfile`: Contains fields for bio, rate, rankings, and structural availability maps.
- `Category`: Groups tutors into specialized fields (e.g., Science, Programming).
- `Booking`: Tracks transaction, time slot, and operational workflow status (`CONFIRMED`, `COMPLETED`, `CANCELLED`).
- `Review`: Holds user star-ratings and textual feedback.

---

##  Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- PostgreSQL database instance

### Installation Steps

https://drive.google.com/drive/my-drive?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto
https://drive.google.com/file/d/1be3e41uaqzyCLk5YCya9lUOTuXNTuayM/view

1. **Clone the Repository:**
   ```bash
   git clone :(https://github.com/hasansaik81/L2-b6-skillbridge4-server)
   cd skillbridge

  
   admin:admin@skillbridge.com
   pass:12345