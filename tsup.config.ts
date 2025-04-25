import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts'],
	bundle: true,
	target: 'node18',
	format: ['cjs'],
	outDir: 'dist',
	splitting: false,
	sourcemap: false,
	clean: true,
})
