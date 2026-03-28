/**
 * Cuida — Seed Data
 *
 * Inserts mock profiles, medical requests, and campaigns into Supabase.
 * Requires real auth users to exist first for doctor profiles.
 *
 * Usage:
 *   1. Copy .env.local.example to .env.local and fill in your Supabase credentials.
 *   2. npx ts-node -e "require('./lib/seed')"
 *      — or use the Supabase dashboard to run the SQL in README.md
 *
 * NOTE: Doctor profiles reference auth.users IDs.
 * For a quick demo, insert the seed SQL directly in the Supabase SQL editor.
 */

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌  Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// ─── Doctor profiles (UUIDs are placeholders — replace with real auth.users IDs) ──

const DOCTOR_PROFILES = [
  {
    id: "d1000000-0000-0000-0000-000000000001",
    full_name: "Dr. Rodrigo Mendes",
    role: "doctor" as const,
    avatar_url: null,
    specialty: "Cardiologia",
    location: "Rio de Janeiro, RJ",
    bio: "Cardiologista com 15 anos de experiência em cardiologia intervencionista. Voluntário no Cuida para oferecer orientação a pacientes de baixa renda.",
  },
  {
    id: "d1000000-0000-0000-0000-000000000002",
    full_name: "Dra. Camila Souza",
    role: "doctor" as const,
    avatar_url: null,
    specialty: "Pediatria",
    location: "São Paulo, SP",
    bio: "Pediatra especializada em desenvolvimento infantil. Acredito que toda criança merece acesso a cuidados de qualidade, independente da condição financeira.",
  },
  {
    id: "d1000000-0000-0000-0000-000000000003",
    full_name: "Dr. Marcus Oliveira",
    role: "doctor" as const,
    avatar_url: null,
    specialty: "Clínica Geral",
    location: "Belo Horizonte, MG",
    bio: "Médico de família e comunidade. Trabalho há 10 anos em atendimento primário e acredito no poder da medicina preventiva para transformar vidas.",
  },
  {
    id: "d1000000-0000-0000-0000-000000000004",
    full_name: "Dra. Patrícia Lima",
    role: "doctor" as const,
    avatar_url: null,
    specialty: "Neurologia",
    location: "Salvador, BA",
    bio: "Neurologista com foco em epilepsia e doenças neurodegenerativas. Voluntaria no Cuida para ajudar pacientes que não têm acesso a consultas especializadas.",
  },
];

// ─── Medical requests ──────────────────────────────────────────────────────────

const MEDICAL_REQUESTS = [
  {
    id: "r1000000-0000-0000-0000-000000000001",
    patient_id: "d1000000-0000-0000-0000-000000000001", // demo: using same IDs
    title: "Preciso de orientação sobre arritmia cardíaca recorrente",
    description:
      "Tenho 58 anos e fui diagnosticado com fibrilação atrial há 6 meses. Estou tomando anticoagulante mas continuo com episódios frequentes de palpitações. Não tenho condições de pagar um cardiologista particular e minha fila no SUS está para daqui a 8 meses. Preciso de orientação sobre se devo ajustar minha medicação e o que fazer durante as crises.",
    specialty_needed: "Cardiologia",
    location: "São Paulo, SP",
    urgency: "high" as const,
    status: "open" as const,
  },
  {
    id: "r1000000-0000-0000-0000-000000000002",
    patient_id: "d1000000-0000-0000-0000-000000000002",
    title: "Filho de 4 anos com crises de asma — preciso de orientação pediátrica",
    description:
      "Meu filho Pedro tem 4 anos e sofre de asma desde os 2 anos. Nos últimos meses as crises pioraram muito, especialmente à noite. Já fui a várias UBSs mas os médicos me deram orientações diferentes. Preciso de um pediatra que me ajude a entender o plano de tratamento correto e quando devo ir à emergência.",
    specialty_needed: "Pediatria",
    location: "Fortaleza, CE",
    urgency: "critical" as const,
    status: "open" as const,
  },
  {
    id: "r1000000-0000-0000-0000-000000000003",
    patient_id: "d1000000-0000-0000-0000-000000000003",
    title: "Dores de cabeça intensas há 3 semanas — preciso de avaliação",
    description:
      "Tenho 32 anos e há 3 semanas acordo todos os dias com uma dor de cabeça muito forte, especialmente na parte de trás da cabeça. Tomei dipirona mas não alivia muito. Não tenho febre. Trabalho muito na frente do computador. Preciso saber se é algo preocupante ou apenas tensional.",
    specialty_needed: "Neurologia",
    location: "Belo Horizonte, MG",
    urgency: "medium" as const,
    status: "open" as const,
  },
  {
    id: "r1000000-0000-0000-0000-000000000004",
    patient_id: "d1000000-0000-0000-0000-000000000004",
    title: "Diabetes tipo 2 descompensada — orientação sobre dieta e medicação",
    description:
      "Tenho 65 anos e diabetes tipo 2 há 10 anos. Minha glicemia está muito alta ultimamente (acima de 300 em jejum). Tomei metformina mas parei pois estava com problemas no estômago. Preciso de orientação sobre como controlar melhor e quais alimentos evitar. Moro em Salvador e a consulta no posto demora muito.",
    specialty_needed: "Clínica Geral",
    location: "Salvador, BA",
    urgency: "high" as const,
    status: "in_progress" as const,
  },
  {
    id: "r1000000-0000-0000-0000-000000000005",
    patient_id: "d1000000-0000-0000-0000-000000000001",
    title: "Acompanhamento pós-operatório de hérnia — dúvidas sobre recuperação",
    description:
      "Fiz cirurgia de hérnia inguinal há 15 dias e estou com dúvidas sobre minha recuperação. Sinto uma leve fisgada no local às vezes ao me levantar. Não sei se é normal ou se devo ir ao pronto-socorro. Preciso de orientação sobre o que é esperado nesse período e quais sinais indicam complicação.",
    specialty_needed: "Clínica Geral",
    location: "Rio de Janeiro, RJ",
    urgency: "low" as const,
    status: "open" as const,
  },
];

// ─── Campaigns ─────────────────────────────────────────────────────────────────

const CAMPAIGNS = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    patient_id: "d1000000-0000-0000-0000-000000000002",
    title: "Cirurgia cardíaca urgente para a Ana Paula — ajude nossa família",
    story: `Meu nome é Jorge Ferreira e minha esposa Ana Paula tem 42 anos. Há dois meses ela foi diagnosticada com uma valva cardíaca gravemente comprometida e os médicos disseram que ela precisa de cirurgia em até 90 dias, ou o risco de infarto é muito alto.

Ana Paula é professora de escola pública e mãe de duas filhas, Isabela de 12 anos e Mariana de 8. Ela é a pessoa mais forte que conheço — nunca reclamou de nada, sempre colocou nossa família em primeiro lugar. Agora preciso ser forte por ela.

A cirurgia custa R$ 48.000 e o plano de saúde só cobre 30%. Já usamos nossas economias, pedimos emprestado para família e amigos, mas ainda estamos longe do que precisamos.

Se você puder ajudar, seja com R$ 10 ou R$ 1.000, saiba que está dando à Ana Paula a chance de ver nossas filhas crescerem. Que está dando a nossas filhas a mãe de volta.

Qualquer valor é um ato de amor. Obrigado de coração.`,
    goal_amount: 48000,
    current_amount: 13440, // 28%
    cover_image_url: null,
    status: "active" as const,
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    patient_id: "d1000000-0000-0000-0000-000000000003",
    title: "Tratamento de leucemia infantil — ajude o Miguel a vencer essa batalha",
    story: `Olá. Sou Fernanda Costa, mãe do Miguel, que tem 7 anos e foi diagnosticado com leucemia linfoblástica aguda em março deste ano.

Quando o médico nos deu o diagnóstico, senti o chão desaparecer. Miguel é uma criança cheia de vida, que adora futebol e sonha em ser astronauta. Ele não entende completamente o que está acontecendo, mas enfrenta cada sessão de quimioterapia com um sorriso que me enche de força.

O protocolo de tratamento é longo — 2 anos de quimioterapia — e os custos com medicações específicas, exames e deslocamentos para o hospital especializado em São Paulo são enormes. Moramos em Campinas, a 100km, e vamos ao hospital duas vezes por semana.

Já arrecadamos bastante graças a pessoas incríveis, mas ainda precisamos de suporte para cobrir os próximos 8 meses de tratamento.

Miguel me pediu para escrever uma mensagem para quem ajudar: "Obrigado por ser meu super-herói." 💚

Juntos, vamos vencer isso.`,
    goal_amount: 35000,
    current_amount: 23450, // 67%
    cover_image_url: null,
    status: "active" as const,
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    patient_id: "d1000000-0000-0000-0000-000000000004",
    title: "Prótese de perna para o seu Antônio — ele quer voltar a caminhar",
    story: `Meu pai, Antônio Carlos, tem 71 anos e perdeu a perna direita em um acidente de trabalho quando tinha 45 anos. Por todos esses anos, ele usou uma prótese básica fornecida pelo SUS que, honestamente, nunca funcionou bem e causou muito desconforto.

Há um ano, a prótese quebrou e não há previsão de substituição pelo sistema público. Meu pai ficou completamente imobilizado — um homem que trabalhou a vida inteira, que criou quatro filhos com muito sacrifício, agora depende de cadeira de rodas para tudo.

A prótese que ele precisa, com amortecimento adequado para a idade e mobilidade dele, custa R$ 22.000. Eu sou professora de escola pública e meus irmãos são autônomos — não temos condições de arcar com esse valor.

Já falta muito pouco! Graças à generosidade de pessoas incríveis, estamos quase lá. Com mais um impulso final, meu pai poderá voltar a caminhar até a janela de casa, ver o pôr do sol, e ter de volta a dignidade e independência que ele tanto merece.

Ajude o seu Antônio a dar seus primeiros passos de volta. Qualquer doação é um passo junto com ele. 💚`,
    goal_amount: 22000,
    current_amount: 20680, // 94%
    cover_image_url: null,
    status: "active" as const,
  },
];

// ─── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Iniciando seed do Cuida...\n");

  // Insert medical requests
  console.log("📋 Inserindo pedidos médicos...");
  const { error: reqError } = await supabase
    .from("medical_requests")
    .upsert(MEDICAL_REQUESTS, { onConflict: "id" });
  if (reqError) {
    console.error("  ❌ Erro nos pedidos:", reqError.message);
  } else {
    console.log(`  ✅ ${MEDICAL_REQUESTS.length} pedidos inseridos`);
  }

  // Insert campaigns
  console.log("💚 Inserindo campanhas...");
  const { error: campError } = await supabase
    .from("campaigns")
    .upsert(CAMPAIGNS, { onConflict: "id" });
  if (campError) {
    console.error("  ❌ Erro nas campanhas:", campError.message);
  } else {
    console.log(`  ✅ ${CAMPAIGNS.length} campanhas inseridas`);
  }

  console.log("\n✨ Seed concluído!");
  console.log("\nNota: Os perfis de médicos precisam de usuários reais em auth.users.");
  console.log("Use o SQL do README.md para inserir perfis de demo diretamente.\n");
}

seed().catch(console.error);

export { DOCTOR_PROFILES, MEDICAL_REQUESTS, CAMPAIGNS };
