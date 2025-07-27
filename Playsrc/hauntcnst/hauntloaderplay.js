const hauntloaderplay = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent !important;
                overflow: hidden;
            }
            .loader-container {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: transparent !important;
            }
            .loader {
                width: 130px;
                height: 130px;
                transform-origin: center;
                animation: rotate4 2s linear infinite;
            }
            .loader circle {
                fill: none;
                stroke:rgb(46, 66, 177);
                stroke-width: 4;
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
                stroke-linecap: round;
                animation: dash4 1.5s ease-in-out infinite;
            }
            @keyframes rotate4 {
                100% {
                    transform: rotate(360deg);
                }
            }
            @keyframes dash4 {
                0% {
                    stroke-dasharray: 1, 200;
                    stroke-dashoffset: 0;
                }
                50% {
                    stroke-dasharray: 90, 200;
                    stroke-dashoffset: -35px;
                }
                100% {
                    stroke-dashoffset: -125px;
                }
            }
        </style>
    </head>
    <body>
        <div class="loader-container">
            <svg class="loader" viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    </body>
    </html>
`;

export default hauntloaderplay;