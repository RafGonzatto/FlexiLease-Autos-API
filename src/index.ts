import { app, startServer } from './app';

const PORT = 3000;

startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});
