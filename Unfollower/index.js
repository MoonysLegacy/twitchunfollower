// Replace these placeholders with your actual values
const twitchUsername = 'MoonysLegacy';
const alertTextElement = document.getElementById('alert-text');

// Function to check for unfollows
function checkForUnfollow() {
    fetch(`https://api.twitch.tv/helix/users/follows?to_id=${twitchUsername}`, {
        method: 'GET',
        headers: {
            'Client-ID': 'YOUR_TWITCH_CLIENT_ID',
            'Authorization': 'Bearer YOUR_TWITCH_ACCESS_TOKEN'
        }
    })
    .then(response => response.json())
    .then(data => {
        const followerCount = data.total;
        // Store the previous follower count (you might want to use local storage or another method)
        const previousFollowerCount = parseInt(localStorage.getItem('previousFollowerCount') || 0);

        if (followerCount < previousFollowerCount) {
            const unfollowedCount = previousFollowerCount - followerCount;
            alertTextElement.innerText = `Unfollowed by ${unfollowedCount} viewer(s):`;

            // Fetch the unfollowed users' details
            fetch(`https://api.twitch.tv/helix/users/follows?to_id=${twitchUsername}&first=${unfollowedCount}`, {
                method: 'GET',
                headers: {
                    'Client-ID': 'YOUR_TWITCH_CLIENT_ID',
                    'Authorization': 'Bearer YOUR_TWITCH_ACCESS_TOKEN'
                }
            })
            .then(response => response.json())
            .then(unfollowedData => {
                const unfollowedUsers = unfollowedData.data;
                unfollowedUsers.forEach(user => {
                    alertTextElement.innerText += `\n${user.from_name}`;
                });

                localStorage.setItem('previousFollowerCount', followerCount);
            })
            .catch(error => {
                console.error('Error fetching unfollowed users:', error);
            });
        }
        // Continue checking periodically
        setTimeout(checkForUnfollow, 300000); // Check every 5 minutes (adjust as needed)
    })
    .catch(error => {
        console.error('Error checking for unfollows:', error);
        // Handle errors here
        // Continue checking periodically even if there's an error
        setTimeout(checkForUnfollow, 300000); // Check every 5 minutes (adjust as needed)
    });
}

// Initial check and start checking for unfollows
checkForUnfollow();
