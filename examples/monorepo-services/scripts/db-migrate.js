console.log('[db] Running database migrations...');
const migrations = ['001_create_users', '002_create_items', '003_add_indexes'];
let i = 0;
const run = () => {
	if (i < migrations.length) {
		console.log(`[db] Applying ${migrations[i]}...`);
		i++;
		setTimeout(run, 600);
	} else {
		console.log(`[db] ${migrations.length} migrations applied successfully`);
		process.exit(0);
	}
};
setTimeout(run, 500);
