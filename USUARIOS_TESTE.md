# Usuários de Teste — Cuida

## Como registrar

Acesse **http://localhost:3001/auth/register** e cadastre cada usuário abaixo,
selecionando o papel correto no **Passo 1** antes de preencher o formulário.

---

## Usuários

### 🏥 Paciente
| Campo | Valor |
|---|---|
| Nome | Ana Paula Ferreira |
| Email | `anapaula.ferreira@yopmail.com` |
| Senha | `Cuidar@2024` |
| Papel | **Preciso de ajuda** (patient) |

Ver inbox: [yopmail.com/anapaula.ferreira](https://yopmail.com/en/wm?login=anapaula.ferreira)

---

### 🩺 Médico
| Campo | Valor |
|---|---|
| Nome | Dr. Rodrigo Mendes |
| Email | `rodrigo.mendes.dr@yopmail.com` |
| Senha | `Saude@2024` |
| Papel | **Quero ajudar** (doctor) |

Ver inbox: [yopmail.com/rodrigo.mendes.dr](https://yopmail.com/en/wm?login=rodrigo.mendes.dr)

---

### 💚 Doador
| Campo | Valor |
|---|---|
| Nome | Carlos Lima |
| Email | `carlos.lima.doador@yopmail.com` |
| Senha | `Ajudar@2024` |
| Papel | **Quero doar** (donor) |

Ver inbox: [yopmail.com/carlos.lima.doador](https://yopmail.com/en/wm?login=carlos.lima.doador)

---

## SQL para atualizar perfis (após registro)

Execute no **Supabase → SQL Editor** para completar os perfis com especialidade e localização:

```sql
UPDATE profiles SET
  location = 'São Paulo, SP',
  bio = 'Paciente em busca de orientação médica voluntária.'
WHERE id = (SELECT id FROM auth.users WHERE email = 'anapaula.ferreira@yopmail.com');

UPDATE profiles SET
  specialty = 'Cardiologia',
  location = 'Rio de Janeiro, RJ',
  bio = 'Cardiologista com 15 anos de experiência. Voluntário no Cuida.'
WHERE id = (SELECT id FROM auth.users WHERE email = 'rodrigo.mendes.dr@yopmail.com');

UPDATE profiles SET
  location = 'Belo Horizonte, MG',
  bio = 'Apoio campanhas de saúde para quem mais precisa.'
WHERE id = (SELECT id FROM auth.users WHERE email = 'carlos.lima.doador@yopmail.com');
```

---

## Notas

- Se Supabase pedir confirmação de email, desative em:
  **Authentication → Settings → Enable email confirmations → OFF**
- Todos os emails são do serviço **yopmail.com** (temporário, sem cadastro)
- As senhas seguem o padrão: palavra em português + `@2024`
