# Haven-Budget-Household-Budget-Management-System

HAVENBUDGET — SETUP NOTES
========================
Open ONLY the HavenBudget subfolder in Visual Studio Code. The documentation and this guide belong outside the source folder. The database SQL is provided in the chat, not in this archive.

1. Create a dedicated Supabase project and execute the four SQL queries in the chat in order. Configure email/password authentication; disable email confirmation only for the classroom project.
2. Install Node.js 22 LTS and Git. Open HavenBudget in VS Code. In its terminal run: npm install
3. Copy .env.example to .env.local. Enter the project's URL and publishable (or anon) key. NEVER put a secret/service-role key in a browser application or commit an env file.
4. Run npm test, npm run build, then npm run dev. Open http://localhost:5173. Use the actual app to register, sign in and test the database features.
5. To authorize an administrator, register a test account then run the separate admin assignment SQL in the chat, using its user UUID. Sign out and back in.
6. Fill the cover information and replace the screenshot placeholders in Documentation using real screenshots from your running app. Keep passwords, keys and sensitive financial details out of screenshots.
7. GitHub: commit meaningful actual changes with your real dates. See the external commit checklist. Do not include .env.local, node_modules, dist or the separate documentation in your repository.
