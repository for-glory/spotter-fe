# Use an official Node.js runtime as a parent image
FROM node:lts as Build
# Create a working directory for your application
WORKDIR /app
# Copy your application files to the container
COPY . /app
# Install any needed packages for frontend and backend
RUN npm install
# Build the frontend
RUN npm run build

FROM nginx:stable-alpine
# Remove the default Nginx configuration and add your own
COPY --from=Build /app/dist /var/www/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy supervisord configuration
#COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
# Start supervisord
#CMD ["/usr/bin/supervisord"]
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]