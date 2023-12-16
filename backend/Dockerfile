FROM python:3.9

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install requirements
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 5001

# Set environment variables
ENV FLASK_APP=main.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

# Start the application
CMD ["python", "main.py"]
