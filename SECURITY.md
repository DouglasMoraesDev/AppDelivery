# 🔐 GUIA DE SEGURANÇA - GEMINI BURGER

## ⚠️ ANTES DE COLOCAR EM PRODUÇÃO

### 1. Variáveis de Ambiente

**Backend (.env):**
```bash
# GERE UM JWT_SECRET FORTE:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Cole o resultado no .env:
JWT_SECRET="resultado_do_comando_acima"
```

**Nunca commite o arquivo .env no Git!**
- Verifique se está no `.gitignore`
- Use variáveis de ambiente do servidor de hospedagem

---

### 2. Banco de Dados

**Senha forte:**
```sql
-- Use senha complexa (min 16 caracteres, letras, números, símbolos)
-- NÃO USE: admin, 123456, password
```

**Backup automático:**
```bash
# Configure backup diário:
mysqldump -u usuario -p gemini_burger > backup_$(date +%Y%m%d).sql
```

**Adicione ao crontab:**
```bash
0 2 * * * /path/to/backup-script.sh
```

---

### 3. HTTPS Obrigatório

**Com Certbot (Let's Encrypt - Grátis):**
```bash
# Instalar
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com.br
```

**Renovação automática:**
```bash
# Já configurado pelo certbot
sudo certbot renew --dry-run
```

---

### 4. Firewall

**Configurar UFW (Ubuntu):**
```bash
sudo ufw enable
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH
sudo ufw status
```

---

### 5. Rate Limiting

**Já implementado no código** (ver próximos passos)
- Limita requisições por IP
- Previne ataques DDoS básicos
- Configurável via `.env`

---

### 6. Validação de Inputs

**Backend usa Zod** para validar:
- Dados de pedidos
- Cadastro de usuários
- Atualização de produtos

**Sempre validar no backend, não confiar no frontend!**

---

### 7. Senhas

**Já usa bcrypt** com salt automático:
- Senhas nunca armazenadas em texto puro
- Hash com 10 rounds (padrão seguro)

---

### 8. CORS

**Configurar domínios permitidos:**
```env
# Em produção, liste APENAS seus domínios
CORS_ORIGIN="https://seusite.com.br,https://www.seusite.com.br"
```

---

### 9. Headers de Segurança

**Adicionar ao nginx/Apache:**
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

---

### 10. Monitoramento

**Recomendações:**
- **UptimeRobot** (grátis) - Monitora se site está online
- **Sentry** - Rastreia erros em produção
- **Logs** - Configure rotação de logs

---

## 📋 CHECKLIST PRÉ-DEPLOY

- [ ] JWT_SECRET gerado com crypto.randomBytes
- [ ] Senhas de banco fortes e únicas
- [ ] HTTPS configurado e funcionando
- [ ] Firewall ativo
- [ ] CORS configurado para domínio específico
- [ ] Rate limiting testado
- [ ] Backup automático configurado
- [ ] .env NÃO está no Git
- [ ] Variáveis de ambiente configuradas no servidor
- [ ] Logs configurados
- [ ] Monitoramento ativo

---

## 🚨 EM CASO DE BRECHA

1. **Mude TODAS as senhas imediatamente**
2. **Gere novo JWT_SECRET** (invalida todos tokens)
3. **Revise logs** para identificar origem
4. **Notifique usuários** se dados vazaram
5. **Corrija vulnerabilidade**
6. **Faça backup** antes de qualquer ação

---

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LGPD - Guia](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
