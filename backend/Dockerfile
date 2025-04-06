# Use the official Python image as a builder base
FROM python:3.12.0 AS builder

# Set environment variables to optimize Python container behavior
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set the working directory in the container
WORKDIR /app

# Create and activate a virtual environment
RUN python -m venv .venv

# Copy the requirements.txt into the container
COPY requirements.txt ./

# Install dependencies into the virtual environment
RUN .venv/bin/pip install -r requirements.txt

# Use a slim Python image for the final build
FROM python:3.12.0-slim

# Install MariaDB client libraries
RUN apt-get update && \
    apt-get install -y libmariadb3 libmariadb-dev && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory for the final container
WORKDIR /app

# Copy the virtual environment from the builder image
COPY --from=builder /app/.venv .venv/

# Copy the application files into the container
COPY . .

# Set the command to run the app using the Flask command
CMD ["/app/.venv/bin/flask", "run", "--host=0.0.0.0", "--port=8080"]