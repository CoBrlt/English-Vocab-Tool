class NotificationManager {
    constructor() {
        // Crée le conteneur si besoin
        this.container = document.createElement("div");
        this.container.id = "notification-container";
        document.body.appendChild(this.container);

        // Applique les styles au conteneur
        this.styleContainer();
    }

    styleContainer() {
        this.container.style.position = "fixed";
        this.container.style.top = "20px";
        this.container.style.right = "20px";
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.gap = "10px";
        this.container.style.zIndex = "1000";
    }

    show(message, type = "success", duration = 3000) {
        // Crée l'élément de notification
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Applique les styles à la notification
        this.styleNotification(notification, type);

        // Ajoute la notification au conteneur
        this.container.appendChild(notification);

        // Supprime la notification après la durée spécifiée
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => this.container.removeChild(notification), 300); // Temps pour l'animation de disparition
        }, duration);
    }

    styleNotification(notification, type) {
        notification.style.padding = "15px";
        notification.style.borderRadius = "5px";
        notification.style.color = "white";
        notification.style.fontSize = "16px";
        notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s ease";
        notification.style.whiteSpace = "normal"; // Permet le retour à la ligne
        notification.style.wordWrap = "break-word"; // Gère le débordement de mots
        notification.style.maxWidth = "300px"; // Limite la largeur maximale

        // Styles selon le type
        if (type === "success") {
            notification.style.backgroundColor = "#4CAF50";
        } else if (type === "error") {
            notification.style.backgroundColor = "#F44336";
        }

        // Animation d'apparition
        setTimeout(() => {
            notification.style.opacity = "1"; // Montre la notification
        }, 10); // Légère temporisation pour l'animation
    }
}

module.exports = NotificationManager;