FROM eclipse-mosquitto

# Copie de votre configuration Mosquitto personnalisée dans le conteneur
COPY mosquitto.conf /mosquitto/config/mosquitto.conf

# Exposez le port Mosquitto
EXPOSE 1883

# Démarrer Mosquitto
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]