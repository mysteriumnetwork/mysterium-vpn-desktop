export const isDevelopment = () => !isProduction()
export const isProduction = () => process.env.NODE_ENV == "production"
