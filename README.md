# Flixoria - Video sharing application

## Overview

This project is a full-stack video sharing application developed using **React Native Expo** for the frontend and **Node.js** with **Express** for the backend. The application allows users to upload, share, and view videos seamlessly, incorporating modern technologies for a rich user experience.

## Technologies Used

- **Frontend:**
  - React Native
  - Expo
  - TailwindCSS
  - Zustand (State Management)
  - TanStack Query (Data Fetching)

- **Backend:**
  - Node.js
  - Express
  - Prisma (ORM)
  - PostgreSQL (Database)

- **Cloud Services:**
  - AWS S3 (To store the content)
  - AWS Lambda (Serverless function to start the ECS containers)
  - AWS ECS (Container Management)

- **Containerization:**
  - Docker

## Features

- **Adaptive Bitrate Streaming:** Automatically adjusts video quality based on user’s internet speed, ensuring smooth playback.
- **Infinite Scroll:** Users can scroll through videos indefinitely, enhancing content discovery.
- **User Authentication:** Secure user login and registration.
- **Video Uploads:** Users can upload videos easily, with support for multiple file formats.
- **Search Functionality:** Quickly find videos by keywords or tags.
- **Responsive Design:** The application is designed to work on both mobile and tablet devices.

## Screenshots

<img width="348" alt="Screenshot 2024-09-24 at 9 35 26 PM" src="https://github.com/user-attachments/assets/fe43c691-3b46-4cd6-9192-1c7a97953fa1">
<img width="347" alt="Screenshot 2024-09-24 at 9 19 24 PM" src="https://github.com/user-attachments/assets/992a8793-b60f-4427-b8a2-48bfd94d2820">
<img width="353" alt="Screenshot 2024-09-24 at 9 17 29 PM" src="https://github.com/user-attachments/assets/8a6d7075-ee6e-446d-afd4-365f4f318d40">
<img width="342" alt="Screenshot 2024-09-24 at 9 22 17 PM" src="https://github.com/user-attachments/assets/82a4a5cc-37c8-4c79-b25e-8ed2a760aab9">

## AWS Architecture for video processing
<img width="847" alt="Screenshot 2024-09-24 at 9 21 45 PM" src="https://github.com/user-attachments/assets/ec23e06c-d054-468c-aa54-b99d1cca2d9d">
