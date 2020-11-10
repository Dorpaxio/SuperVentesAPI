module.exports = {
    domain: process.env.SUPERVENTES_DOMAIN || '',
    port: process.env.SUPERVENTES_PORT || 1311,
    db: process.env.SUPERVENTES_DB || 'superventes',
    rsa_path: './private/jwtRS256.key',
    rsa_pub_path: './private/jwtRS256.key.pub',
    token_expiration: '52w'
}
