# Twitch Party Games

**Twitch Party Games** is a Twitch extension designed to bring viewers together through interactive games, turning passive watching into active participation. With engaging games like Trivia, Drawing and Guessing, and Tic-Tac-Toe, this extension is perfect for streamers who want to foster community interaction directly on their Twitch stream.

## Table of Contents
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Challenges](#challenges)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## About

Built for the **Interactive Community Experiences** category of a Twitch hackathon, **Twitch Party Games** enables real-time interaction between streamers and viewers. Viewers can join games and chat with each other and the streamer, creating a collaborative and fun atmosphere. The extension uses **Twitch API for authentication** to securely manage viewer and streamer roles.

## Features

- **Twitch Authentication**: Secure login with role-based access for viewers and streamers.
- **Interactive Games**:
  - **Trivia Game**: Test knowledge with multiple-choice questions.
  - **Drawing and Guessing Game**: Viewers guess as the streamer draws.
  - **Tic-Tac-Toe**: A classic game for head-to-head fun.
- **Real-Time Communication**: Integrated chat for viewers to interact with each other and the streamer.
- **Streamer Controls**: Tools for managing games, starting sessions, and monitoring players.
- **Live Leaderboard**: Display current scores and rankings for each game.

## Installation

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- A **Twitch Developer Account** to set up the Twitch API and register the extension.

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/twitch-party-games.git
    cd twitch-party-games
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
    ```plaintext
    TWITCH_CLIENT_ID=your_twitch_client_id
    TWITCH_CLIENT_SECRET=your_twitch_client_secret
    TWITCH_REDIRECT_URI=your_redirect_uri
    MONGO_URI=your_mongodb_connection_string
    ```

4. **Start the Development Server**:
    ```bash
    npm start
    ```

5. **Set Up Twitch Extension**:
   - Go to the [Twitch Developer Console](https://dev.twitch.tv/console).
   - Register your extension with the necessary OAuth and WebSocket permissions.
   - Set the OAuth redirect URL to match your `.env` `TWITCH_REDIRECT_URI`.

6. **Run the Application**:
   The application should now be running on `http://localhost:3000`. You can log in as a viewer or streamer to access the corresponding features.

## Usage

1. **Viewer Login**: Viewers can log in via Twitch OAuth to join games and chat.
2. **Streamer Login**: Streamers can log in to start games, manage participants, and moderate the chat.
3. **Selecting a Game**: After logging in, choose one of the available games from the Game Lobby.
4. **Interactive Chat**: Use the chat feature to interact with others and get real-time updates on game progress.

## Tech Stack

- **Frontend**: React.js, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-Time Communication**: WebSocket (socket.io-client)
- **Authentication**: Twitch API (OAuth)
- **Styling**: CSS, styled-components

## Challenges

Some of the main challenges included:
- **Real-Time Updates**: Managing seamless updates across multiple players without lag.
- **Role-Based Authentication**: Ensuring viewers and streamers have different levels of access and interaction.
- **Game Synchronization**: Keeping game data consistent across sessions and for all players.

## Future Enhancements

- **Additional Games**: Adding new games to expand interaction options.
- **Customizable Game Settings**: Allowing streamers to adjust game settings to fit their audience.
- **Enhanced UI and Animations**: Making the interface more visually engaging and intuitive.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
