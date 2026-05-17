# QR Code Setup Instructions

The student management system now generates QR codes server-side for better reliability and privacy.

## Installation (Choose One)

### Option 1: Automatic Setup (Recommended)

Run the setup script from your terminal:

```bash
cd /path/to/student-management-system
php setup-qrcode.php
```

This will automatically download and extract the `php-qrcode` library.

### Option 2: Manual Installation

1. Download: https://github.com/chillerlan/php-qrcode/archive/main.zip
2. Create the directories: `lib/phpqrcode/`
3. Extract the ZIP contents into `lib/phpqrcode/`
4. Folder structure should look like:
   ```
   lib/
   └── phpqrcode/
       ├── src/
       │   ├── QRCode.php
       │   ├── QROptions.php
       │   ├── QRMatrix.php
       │   ├── Output/
       │   ├── Interfaces/
       │   └── ...
       ├── composer.json
       └── README.md
   ```

## Verification

After installation, test the QR generation:

1. Go to the Teacher Dashboard
2. Click the QR button on any student row
3. The QR code should display instantly
4. Click "Download QR" to save the PNG file

## Troubleshooting

**Error: "QR Code library not installed"**

- Run `php setup-qrcode.php` again
- Or manually extract the library to `lib/phpqrcode/`

**QR Code not displaying**

- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check browser console for errors (F12)
- Verify `lib/phpqrcode/src/QRCode.php` exists

**Download not working**

- Check that the `lib/phpqrcode/` directory has proper permissions
- Try a different browser

## How It Works

- QR codes are generated **on the server** using the `chillerlan/php-qrcode` library
- Each student's QR is **unique and fixed** based on their student ID
- QR codes are **generated on-demand** (not cached, always current)
- Data stays on your **local server** (no external API calls)

## Future Improvements

- Add QR code caching for better performance
- Add QR code customization (colors, logos, etc.)
- Bulk QR code generation and printing
