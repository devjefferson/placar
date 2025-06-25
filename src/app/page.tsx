'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storageService';
import { Team, Player } from '@/types';

export default function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const teamsData = StorageService.getTeams();
        setTeams(teamsData);
        
        // Extrair todos os jogadores de todos os times
        const allPlayers: Player[] = [];
        teamsData.forEach(team => {
          allPlayers.push(...team.players);
        });
        setPlayers(allPlayers);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calcular estatísticas
  const totalTeams = teams.length;
  const totalPlayers = players.length;
  const topScorer = players.length > 0 
    ? players.reduce((prev, current) => 
        (prev.goals || 0) > (current.goals || 0) ? prev : current
      )
    : null;

  const news = [
    {
      id: 1,
      title: "Temporada 2024 Iniciada",
      content: "A nova temporada do campeonato está oficialmente aberta com grandes expectativas.",
      date: "15/01/2024",
      image: "/logo-veterano.svg"
    },
    {
      id: 2,
      title: "Recorde de Gols",
      content: "Nova marca histórica de gols marcados em uma única partida.",
      date: "12/01/2024",
      image: "/logo-25-anos.svg"
    },
    {
      id: 3,
      title: "Novos Jogadores",
      content: "Reforços chegam para fortalecer os times na disputa pelo título.",
      date: "10/01/2024",
      image: "/logo-veterano.svg"
    }
  ];

  const sponsors = [
    { name: "WBD Veículos", logo: "/sponsors/wbd-veiculos.svg" },
    { name: "MAGNATAS Distribuidora", logo: "/sponsors/magnatas.svg" },
    { name: "WILIAN Bar e Refeições", logo: "/sponsors/wilian-bar.svg" },
    { name: "MERCADO PONTO CERTO", logo: "/sponsors/mercado-ponto-certo.svg" },
    { name: "5 MARIAS Material de Construção", logo: "/sponsors/5-marias.svg" },
    { name: "PROJETO VILELA", logo: "/sponsors/magnatas.svg" }
  ];

  const partners = [
    { name: "Barbeshop Vinicius Negão", logo: "/sponsors/wilian-bar.svg" },
    { name: "Diniz Multi Marcas", logo: "/sponsors/wbd-veiculos.svg" },
    { name: "Eletrônica Durval Feijão", logo: "/sponsors/magnatas.svg" },
    { name: "LF Cell Assistência Técnica", logo: "/sponsors/wilian-bar.svg" },
    { name: "Mansão021", logo: "/sponsors/magnatas.svg" },
    { name: "Padaria O Rei do Pão", logo: "/sponsors/wilian-bar.svg" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logo-25-anos.svg" 
                alt="25 Anos" 
                width={300} 
                height={150}
                className="w-64 h-32 md:w-80 md:h-40"
              />
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Bem-vindo ao Grupo de Amigos Veterano 5 Marias. 
              Uma história de paixão pelo futebol e amizade.
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {loading ? "..." : totalTeams}
              </div>
              <div className="text-white">Times Cadastrados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {loading ? "..." : totalPlayers}
              </div>
              <div className="text-white">Jogadores</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {loading || !topScorer ? "..." : topScorer.goals || 0}
              </div>
              <div className="text-white">Recorde de Gols</div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/public">
              <button className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                <span>📊</span>
                <span>Ver Resultados</span>
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 flex items-center space-x-2">
                <span>⚙️</span>
                <span>Administração</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Notícias */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Últimas Notícias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={80} 
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-4">{item.content}</p>
                <div className="text-yellow-400 text-sm">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Patrocinadores */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Patrocinadores Oficiais
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="flex justify-center mb-2">
                  <Image 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    width={120} 
                    height={80}
                    className="w-20 h-12 md:w-24 md:h-16"
                  />
                </div>
                <div className="text-white text-sm font-medium">{sponsor.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Parceiros */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Parceiros Oficiais
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                <div className="flex justify-center mb-2">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    width={120} 
                    height={80}
                    className="w-20 h-12 md:w-24 md:h-16"
                  />
                </div>
                <div className="text-white text-sm font-medium">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Image 
                    src="/logo-veterano.svg" 
                    alt="Veterano FC" 
                    width={24} 
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">VETERANO 5 MARIAS</h3>
                </div>
              </div>
              <p className="text-gray-400">
                Grupo de amigos unidos pela paixão pelo futebol há 25 anos.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Siga-nos em</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <span className="text-xl">📺</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <span className="text-xl">📘</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Links Úteis</h4>
              <div className="space-y-2">
                <Link href="/public" className="block text-gray-400 hover:text-yellow-400 transition-colors">
                  Resultados
                </Link>
                <Link href="/dashboard" className="block text-gray-400 hover:text-yellow-400 transition-colors">
                  Administração
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Grupo de Amigos Veterano 5 Marias. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
