FROM eclipse-mosquitto

# Create a password file and add a user
RUN touch /mosquitto/config/pwfile && \
    mosquitto_passwd -b /mosquitto/config/pwfile user1 123

# Copy your custom Mosquitto configuration into the container
COPY mosquitto.conf /mosquitto/config/mosquitto.conf

# Expose the Mosquitto port
EXPOSE 1883

# Start Mosquitto
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]
