import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';

const API_KEY = 'b8ced12264314836a15123945240309'; // 🟡 Substitua pela sua chave da WeatherAPI.com

export default function App() {
  const [cidade, setCidade] = useState('');
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarClima = async () => {
    if (!cidade) return;
    setCarregando(true);
    setErro(null);
    Keyboard.dismiss();

    try {
      const resposta = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cidade}&lang=pt`
      );
      const dados = await resposta.json();

      if (resposta.ok && dados.current) {
        setClima({
          temp: dados.current.temp_c,
          descricao: dados.current.condition.text,
          icone: `https:${dados.current.condition.icon}`,
          nome: dados.location.name
        });
      } else {
        setErro('Cidade não encontrada!');
        setClima(null);
      }
    } catch (e) {
      setErro('Erro ao buscar o clima.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Previsão do Tempo</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade"
        value={cidade}
        onChangeText={setCidade}
      />

      <Button title="Buscar" onPress={buscarClima} />

      {carregando && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {erro && <Text style={styles.erro}>{erro}</Text>}

      {clima && (
        <View style={styles.resultado}>
          <Text style={styles.cidade}>{clima.nome}</Text>
          <Image source={{ uri: clima.icone }} style={styles.icone} />
          <Text style={styles.temperatura}>{clima.temp}°C</Text>
          <Text style={styles.descricao}>{clima.descricao}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#2196F3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  resultado: {
    marginTop: 30,
    alignItems: 'center'
  },
  cidade: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  temperatura: {
    fontSize: 50,
    fontWeight: '300'
  },
  descricao: {
    fontSize: 18,
    fontStyle: 'italic',
    textTransform: 'capitalize'
  },
  icone: {
    width: 100,
    height: 100
  },
  erro: {
    color: 'red',
    marginTop: 20
  }
});
