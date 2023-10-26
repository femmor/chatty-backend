/**
 * @fileOverview Application configuration class
 */

import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config();

// config class
class Config {
	public PORT: string | undefined;
	public MONGO_URI: string | undefined;
	public NODE_ENV: string | undefined;
	public JWT_SECRET: string | undefined;
	public SECRET_KEY_ONE: string | undefined;
	public SECRET_KEY_TWO: string | undefined;
	public CLIENT_URL: string | undefined;
	public REDIS_HOST: string | undefined;
	public CLOUDINARY_NAME: string | undefined;
	public CLOUDINARY_KEY: string | undefined;
	public CLOUDINARY_SECRET: string | undefined;

	constructor() {
		this.PORT = process.env.PORT || '5005';
		this.MONGO_URI = process.env.MONGO_URI || this.MONGO_URI;
		this.NODE_ENV = process.env.NODE_ENV || '';
		this.JWT_SECRET = process.env.JWT_SECRET || '';
		this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
		this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
		this.CLIENT_URL = process.env.CLIENT_URL || '';
		this.REDIS_HOST = process.env.REDIS_HOST || '';
		this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || '';
		this.CLOUDINARY_KEY = process.env.CLOUDINARY_KEY || '';
		this.CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET || '';
	}

	// logger method for custom logging
	public createLogger(name: string): bunyan {
		return bunyan.createLogger({
			name,
			level: 'debug'
		});
	}

	// Validates config
	public validateConfig(): void {
		for (const [key, value] of Object.entries(this)) {
			if (value === undefined) {
				throw new Error(`Configuration ${key} is undefined`);
			}
		}
	}

	// Cloudinary config
	public cloudinaryConfig(): void {
		cloudinary.v2.config({
			cloud_name: this.CLOUDINARY_NAME,
			api_key: this.CLOUDINARY_KEY,
			api_secret: this.CLOUDINARY_SECRET
		});
	}
}

export const config: Config = new Config();
