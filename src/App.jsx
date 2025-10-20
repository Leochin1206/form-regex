import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { InputField } from './components/inputField';

const formSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
  dataNascimento: z.string()
    .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      message: 'Data inválida. Use o formato DD/MM/AAAA.',
    }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  nomeUsuario: z.string().min(4, { message: 'O nome de usuário deve ter no mínimo 4 caracteres.' }).regex(/^[a-z0-9_.]+$/, { message: 'Use apenas letras minúsculas, números e underlines.' }),
  senha: z.string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: 'A senha precisa conter letra maiúscula, minúscula, número e um caractere especial.',
    }),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, { message: 'CEP inválido. Formato esperado: 00000-000.' }),
  rua: z.string().min(1, { message: 'A rua é obrigatória.' }),
  numero: z.string().min(1, { message: 'O número é obrigatório.' }),
  telefone: z.string().regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, { message: 'Número de telefone inválido.' }),
});

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepMessage, setCepMessage] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      dataNascimento: '',
      email: '',
      nomeUsuario: '',
      senha: '',
      cep: '',
      rua: '',
      numero: '',
      telefone: '',
    }
  });

  const cepValue = watch('cep');

  useEffect(() => {
    const fetchAddress = async (cep) => {
      setCepLoading(true);
      setCepMessage('');
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
          setValue('rua', '');
          setCepMessage('CEP não encontrado.');
        } else {
          setValue('rua', data.logradouro || '', { shouldValidate: true });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepMessage('Erro ao buscar CEP.');
      } finally {
        setCepLoading(false);
      }
    };

    const cleanedCep = cepValue?.replace(/\D/g, '');
    if (cleanedCep?.length === 8) {
      fetchAddress(cleanedCep);
    } else {
      setValue('rua', '');
    }
  }, [cepValue, setValue]);

  const onSubmit = (data) => {
    console.log('Dados do formulário enviados:', data);
    alert('Formulário enviado com sucesso! Verifique os dados no console do navegador.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">Crie sua Conta</h1>
        <p className="text-gray-600 text-center mb-8">Preencha os campos abaixo para se cadastrar.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t pt-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2 -ml-2">Informações Pessoais</legend>
            <InputField label="Nome Completo" id="nome" register={register} error={errors.nome} placeholder="Seu nome completo" />
            <InputField label="Data de Nascimento" id="dataNascimento" register={register} error={errors.dataNascimento} placeholder="DD/MM/AAAA" />
            <InputField label="E-mail" id="email" type="email" register={register} error={errors.email} placeholder="seu.email@exemplo.com" />
            <InputField label="Nome de Usuário" id="nomeUsuario" register={register} error={errors.nomeUsuario} placeholder="usuario_123" />
            <div className="w-full relative">
              <InputField label="Senha" id="senha" type={showPassword ? 'text' : 'password'} register={register} error={errors.senha} placeholder="********" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 border-t pt-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4 px-2 -ml-2">Endereço e Contato</legend>
            <div className="w-full">
              <InputField label="CEP" id="cep" register={register} error={errors.cep} placeholder="00000-000" />
              {cepLoading && <p className="text-xs text-blue-600 mt-1">Buscando...</p>}
              {cepMessage && <p className="text-xs text-red-600 mt-1">{cepMessage}</p>}
            </div>
            <InputField label="Rua / Logradouro" id="rua" register={register} error={errors.rua} placeholder="Sua rua será preenchida" readOnly className="bg-gray-100 cursor-not-allowed" />
            <InputField label="Número" id="numero" register={register} error={errors.numero} placeholder="123" />
            <div className="md:col-span-3">
              <InputField label="Telefone" id="telefone" type="tel" register={register} error={errors.telefone} placeholder="(11) 98765-4321" />
            </div>
          </fieldset>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}