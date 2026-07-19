console.log(`→ Loading Happy DOM environment...`);
await import(`./register-happy-dom`);

console.log(`→ Extending expect with @testing-library/jest-dom matchers...`);
await import(`./extend-testing-library-with-jest-dom-matchers`);

console.log(`✅ Bun test preload complete`);
export {};
