export const emailTemplate = (details: any) => `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #e4e4e4;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #4caf50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            line-height: 1.6;
        }
        .email-body p {
            margin: 10px 0;
        }
        .email-body .highlight {
            color: #4caf50;
            font-weight: bold;
        }
        .email-footer {
            text-align: center;
            background-color: #f1f1f1;
            padding: 10px;
            font-size: 14px;
            color: #777;
        }
        .email-footer a {
            color: #4caf50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Payment Successful!</h1>
        </div>
        <div class="email-body">
            <p>Dear <span class="highlight">${details.name}</span>,</p>
            <p>We are thrilled to inform you that your payment of <span class="highlight">$10</span> has been successfully processed.</p>
            <p>Thank you for your trust in us. If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
            <p>Warm regards,</p>
            <p><strong>${details.companyName}</strong></p>
        </div>
    </div>
</body>
</html>`;
