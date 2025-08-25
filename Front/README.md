# Build complete App
## Docker Compose Setup

This application its divided in two repositories independently (the backend side and -this repo- the frontend). We use docker-compose to connect  correctly both sides.

## Prerequisites

Make sure you have Docker desktop installed
```bash
docker-compose --version 

# Output must be like:
# docker-compose version 1.26.0, build d4451659
```
- [Docker Desktop](https://www.docker.com/products/)

## Getting Started

### 1. Download the bundle

- [Swicher App Bundle](https://drive.google.com/drive/folders/1DsaiK8SpzdQuC_8j8ipUK7_95a_7CCJw?usp=sharing)

### 2. Unzip the file and  open a terminal in the folder

```bash
. # <- You  must be here.
├── docker-compose.yml
├── swicher-app-back
└── swicher-app-front

```

### 3. Build and Start the Containers

To build the images and start the containers, run:

```bash
docker-compose up --build
```

This will build the Docker images specified in the `docker-compose.yml` file and start all services in detached mode.

### 4. Access the Application

Once the services are up, you can access the application in your browser (`http://localhost` to see the frontend and `http://localhost:8000` is the entry point to te backend).

You can check the logs of the containers in the same termial:


### 5. Stop the Containers

To stop the running containers, run:

```bash
# Press: Ctrl+C
```

# Run Frontend in dev mode

### 1. Download this repo
```bash
 git clone https://github.com/IngSoft1-grupo1234/swicher-app-front.git
 
 cd swicher-app-front
```

### 2. Change branch to develop
```bash
 git checkout origin/develop 
```

### 3. Built and Run the image
```bash
docker build . -t swicher-front && docker run -it swicher-front /bin/bash

```

### 4. Run views or tests
> Vite in dev mode
```bash
npm run dev
```

> Run test with vitest
```bash
npm run test
```
> If you want to exit from docker:
```bash
exit
```