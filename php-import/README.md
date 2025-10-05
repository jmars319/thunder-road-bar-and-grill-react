This folder is a temporary import area for the PHP repo you want to adopt.

Instructions:
1. Copy the entire PHP project into this folder (preserving subfolders). For example (run from your machine):

   rsync -av "/absolute/path/to/thunder-road-bar-and-grill/" "/absolute/path/to/thunder-road-bar-and-grill-react/php-import/"

2. Commit the files on the `adopt-layout/from-php` branch. I will inspect and apply layout/CSS changes to the React project from that branch.

3. After we've completed the migration, you can remove this folder and any PHP files by deleting this directory and creating a follow-up commit.

Notes:
- The `.gitignore` in the repo already excludes `vendor/` and common PHP artifacts.
- Be careful not to accidentally copy sensitive config or `.env` files. If the PHP repo contains credentials, remove or replace them before committing. Replace secrets with placeholders like `[REDACTED]`.
