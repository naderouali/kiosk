"# Kiosk Project" 

Welcome to the **Kiosk App** case study! This repository contains the skeleton of Kiosk's latest application: the **Audit App**.

---

## Context
The **CSRD** is a new European regulation requiring companies to produce yearly sustainability reports. These reports must then be audited, which is where this application comes into play!

The goal of this project is to **help auditors** with a simple tasking system, enabling them to:
- Create tasks
- Assign tasks
- Filter tasks
- Create sub-tasks
- Reorder tasks

---

## Goals and Features

### 1. Users can create tasks
A task includes:
- **Title**
- **State**: `TODO` / `DOING` / `DONE`
- **Owner**
- **(Optional)** Description

Users can view tasks on a **checklist page** where they can create and delete tasks.

### 2. Users can filter tasks
Users can filter tasks by:
- **Owner**
- **State**
- **Name**

If multiple filters are active, the result will be the **intersection** of all filters.

### 3. Users can create sub-tasks
Sub-tasks help break down complex tasks and include:
- **Name**
- **State**: `TODO` / `DONE`

Sub-tasks appear below their parent tasks and are easily toggleable (show/collapse).

### 4. Users can reorder tasks
Tasks can be reordered using **drag-and-drop** functionality.

---

## Project Screenshots and Video
1. ![Tasks](./screens/Screenshot%202024-12-17%20005725.png)
2. ![Task update](./screens/Screenshot%202024-12-17%20005739.png)

---

## Steps to Run the Project
Follow the steps below to set up and run the application locally:

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Setup the Database**:
   Run Prisma to manage the database and visualize it in the Prisma Studio:
   ```bash
   npx prisma studio
   ```

3. **Create a User**:
   Before running the project, make sure to create at least one user entry in the database.

4. **Run the Project**:
   Start the development server with:
   ```bash
   pnpm dev
   ```

The application will now be running locally. Access it via your browser at `http://localhost:5174`.