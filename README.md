# 🚗 CarCheck

## 💡 Project Idea
**CarCheck** is a comprehensive web platform dedicated to managing and streamlining the car inspection process. The application directly connects users who want a detailed vehicle check with authorized mechanics.

The main goal is to provide a transparent and digitized workflow: from creating an inspection request and securely paying for the service, to a mechanic taking over the car and generating a detailed official report.

## ✨ Key Features

* **Authentication & Role System:** Users can register and log in securely. The platform clearly distinguishes between clients (who request inspections) and mechanics (who have a dedicated dashboard to accept and complete tasks).
* **Inspection Management:** Clients can submit new requests for car checks, track their status, and view their inspection history.
* **Integrated Secure Payments:** The application uses Stripe to allow users to pay for inspection services quickly and securely directly within the platform.
* **Automated PDF Reports:** Upon completion of an inspection, the system automatically generates a detailed technical report in PDF format, which can be downloaded by the client.
* **File & Image Uploads:** Mechanics or users can upload relevant documents and photos regarding the car's condition, powered by UploadThing.
* **Email Notifications:** The platform automatically sends transactional emails (e.g., inspection status updates) to maintain efficient communication between the client and the mechanic.
* **Review System:** After the process is completed, clients have the opportunity to leave a review for the services provided.

## 🛠️ Tech Stack
To support these features, the project is built on a modern technology stack:
* **Frontend & Backend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Database / ORM:** Prisma
* **Payments:** Stripe
* **File Management:** UploadThing
* **Emails:** Resend & React Email
* **PDF Generation:** @react-pdf/renderer
