(() => {
  const players = [
    { id: 1, name: "Anas", rating: 1199 },
    { id: 2, name: "Arya", rating: 1199 },
    { id: 3, name: "Antoine ", rating: 1199 },
    { id: 4, name: "Capucine", rating: 1199 },
    { id: 5, name: "Chiara", rating: 1199 },
    { id: 6, name: "Estéban", rating: 1199 },
    { id: 7, name: "Gabriel", rating: 1199 },
    { id: 8, name: "Ilyan", rating: 1199 },
    { id: 9, name: "Luna", rating: 1199 },
    { id: 10, name: "Malek", rating: 1199 },
    { id: 11, name: "Marius", rating: 1199 },
    { id: 12, name: "Octave", rating: 1199 },
    { id: 13, name: "Simon", rating: 1199 },
    { id: 14, name: "Solal", rating: 1199 },
    { id: 15, name: "Aydan", rating: 1199 },
    { id: 16, name: "Daniil", rating: 1199 },
    { id: 17, name: "Elena", rating: 1199 },
    { id: 18, name: "Emilien", rating: 1199 },
    { id: 19, name: "Eva", rating: 1199 },
    { id: 20, name: "Giulia", rating: 1199 },
    { id: 21, name: "Hadrien", rating: 1199 },
    { id: 22, name: "Joran", rating: 1199 },
    { id: 23, name: "Maxence", rating: 1199 },
    { id: 24, name: "Philipp", rating: 1199 },
    { id: 25, name: "Ruben", rating: 1199 }
  ];

  localStorage.setItem("app_players", JSON.stringify(players));
})();