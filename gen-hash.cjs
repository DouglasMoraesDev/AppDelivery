const bcrypt = require('bcryptjs');

// Gerar hash para senha 123456
const password = '123456';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Erro:', err);
    return;
  }
  console.log('Hash para senha 123456:');
  console.log(hash);
});
