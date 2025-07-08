# Use the official lightweight Python image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . /app/

# Expose the port the app runs on
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
