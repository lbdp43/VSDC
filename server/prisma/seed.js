const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Les 33 entreprises de l'annuaire VSBC (édition 2026). L'annuaire papier ne diffuse
// ni téléphone ni email : chaque membre reçoit une adresse provisoire (@membres.vsbc.local)
// que l'admin remplace par la vraie depuis l'administration (le membre pourra alors se connecter).
const ANNUAIRE = [
  ['2 IT Solutions', 'Solutions Informatiques, Bureautiques et Télécoms', 'Charlie', 'Tabbi'],
  ['AG Conduite', 'Auto École', 'Alain', 'Gathion'],
  ['Alise Sandron', 'Plâtrerie, Génie Civil', 'Arthur', 'Sandron'],
  ['Allianz', 'Assurance', 'Romain', 'Froget'],
  ['Alti Matériaux Gedimat', 'Négoce de matériaux', 'Florent', 'Pichon'],
  ['As de Trèfle Paysage', 'Paysagiste', 'Quentin', 'Manya'],
  ["Atelier E'Deco", "Architecture d'Intérieur", 'Edith', 'Torres'],
  ['Au Domaine des Vins', 'Grossiste en Vin', 'Julien', 'Hernandez'],
  ['AVI Art & Fenêtres', 'Menuiseries Extérieures', 'Nicolas', 'Frachette'],
  ['Brasserie des Plantes', 'Liquoriste', 'Etienne', 'Darinot'],
  ['Cecile Robin Construction', 'Constructeur Maison Individuelle et Bâtiments Professionnels', 'Benjamin', 'Bessette'],
  ["Ced'Deco", 'Peinture Décoration', 'Cedric', 'Legros'],
  ['Crédit Agricole', 'Banque', 'Sylviane', 'Patouillard'],
  ['Domaine de la Bruyère', "Accueil de Groupes et d'Entreprises", 'Lionel', 'Boucher'],
  ['Elec 2 JP', 'Électricien', 'Jean Philippe', 'Januel'],
  ['Entreprise Jolivet & Cie', 'Décolletage et Mécanique de Précision', 'Cedric', 'Jolivet'],
  ['Exco Loire', 'Expertise Comptable', 'Julien', 'Mandon'],
  ['Guignand TP', 'Travaux Publics', 'Martin', 'Guignand'],
  ['Institut Harmony', 'Esthéticienne', 'Angele', 'Soumet'],
  ['IRUP', "Établissement d'Enseignement Supérieur", 'Bertrand', 'Masseboeuf'],
  ["L'Atelier des Flammes", 'Vente, Installation et Ramonage Poêle et Cheminée', 'Nicolas', 'Petit'],
  ['La Cuisine de Chanthy', 'Cheffe à domicile - Cuisine Événementielle', 'Chanthy', 'Jolivet'],
  ['Les Nuits de Saint Bonnet', 'Hébergement Touristique Haut de Gamme', 'Priscille', 'Bessette'],
  ['Mon Experto', 'Courtage Prêt', 'Stephanie', 'Teyssier'],
  ['Moulin Bois Énergie', 'Scierie - Production Granulés Bois', 'Joseph', 'Tixier'],
  ['Norauto', 'Centre Automobile', 'Jean Laurent', 'Goudet'],
  ['Plastech', 'Maintenance Industrielle', 'Ludovic', 'Grange'],
  ['Propriétés Privées', 'Conseiller Immobilier', 'Nicolas', 'Antonelli'],
  ["Rénov'Toit", 'Charpente Couverture', 'Fabien', 'Massard'],
  ['S2I Capital', 'Société Spécialisée en Investissement Immobilier', 'Gianni', 'Bernocolo'],
  ['Serhochian Bouard', 'Plomberie Chauffagiste', 'Stephane', 'Bouard'],
  ['Sports Clubs Collectivité', "Fourniture d'Équipements Sportifs et de Matériel", 'Norbert', 'Aulagnier'],
  ['TM Auto Exclusive', 'Concession Automobile', 'Thomas', 'Mok']
];

// « Jean Philippe Januel » → jean-philippe.januel@membres.vsbc.local
function placeholderEmail(firstName, lastName) {
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slug(firstName)}.${slug(lastName)}@membres.vsbc.local`;
}

async function main() {
  console.log('Initialisation des données...');

  // 1. Paramètres du club
  await prisma.clubSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Velay Semène Business Club',
      description: "Club d'affaires du Velay Semène, porté par le FCDS : échanges, recommandations et collaborations entre professionnels du territoire.",
      contactEmail: 'contact@vsbc-fcds.fr',
      address: 'Velay Semène'
    }
  });
  console.log('Paramètres du club créés.');

  // 2. Compte admin initial
  const adminEmail = 'admin@vsbc-fcds.fr';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      role: 'admin',
      status: 'active',
      onboardingDone: true
    }
  });

  await prisma.member.upsert({
    where: { id: admin.id },
    update: {},
    create: {
      id: admin.id,
      companyName: 'Velay Semène Business Club',
      jobTitle: 'Administration',
      phone: '',
      address: '',
      city: 'Velay Semène'
    }
  });
  console.log('Compte admin créé:', adminEmail);

  // 2b. Compte admin La Brasserie des Plantes (membre n°10 de l'annuaire)
  const brasserie = await prisma.user.upsert({
    where: { email: 'labrasseriedesplantes@gmail.com' },
    update: { role: 'admin' },
    create: {
      email: 'labrasseriedesplantes@gmail.com',
      role: 'admin',
      status: 'active',
      onboardingDone: false
    }
  });

  await prisma.member.upsert({
    where: { id: brasserie.id },
    update: {},
    create: {
      id: brasserie.id,
      firstName: 'Etienne',
      lastName: 'Darinot',
      companyName: 'Brasserie des Plantes',
      jobTitle: 'Liquoriste',
      phone: '0684444044',
      address: '',
      city: 'Saint-Didier-en-Velay',
      website: 'https://www.labrasseriedesplantes.com',
      description: "Artisan-Liquoriste. Création d'apéritifs et spiritueux à base de plante et de fruit."
    }
  });
  console.log('Compte admin créé: labrasseriedesplantes@gmail.com');

  // 2c. Les 33 entreprises de l'annuaire
  for (const [companyName, jobTitle, firstName, lastName] of ANNUAIRE) {
    // La Brasserie des Plantes a déjà son compte (admin) ci-dessus
    if (companyName === 'Brasserie des Plantes') continue;

    const email = placeholderEmail(firstName, lastName);
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        role: 'member',
        status: 'active',
        onboardingDone: true
      }
    });

    await prisma.member.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        firstName,
        lastName,
        companyName,
        jobTitle,
        phone: '',
        address: '',
        city: ''
      }
    });

    console.log(`Membre créé: ${companyName} (${firstName} ${lastName})`);
  }

  // 3. Rencontres mensuelles (d'après les affiches du club)
  const events = [
    {
      title: 'Rencontre Novembre — Brasserie des Plantes',
      type: 'afterwork',
      date: '2026-11-05',
      timeStart: '19:00',
      location: 'Mairie de Saint-Didier-en-Velay (Salle 14)',
      description: 'Présentation et dégustation des produits de la Brasserie des Plantes, suivie d\'un cocktail dînatoire.\n\nRéservé aux membres du Business Club.'
    },
    {
      title: 'Rencontre Décembre — Institut Harmony',
      type: 'afterwork',
      date: '2026-12-04',
      timeStart: '18:00',
      location: 'Salle de la Halle de Saint-Didier-en-Velay',
      description: 'Présentation et visite de l\'institut Harmony, apéritif de Noël, suivi du traditionnel brasero huîtres du club FCDS.\n\nRéservé aux membres du Business Club.'
    }
  ];

  for (const evt of events) {
    const existing = await prisma.event.findFirst({
      where: { title: evt.title, date: new Date(evt.date) }
    });
    if (!existing) {
      await prisma.event.create({
        data: { ...evt, date: new Date(evt.date), createdBy: admin.id }
      });
      console.log(`Événement créé: ${evt.title}`);
    }
  }

  console.log('Seed terminé avec succès !');
}

main()
  .catch(e => {
    console.error('Erreur seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
