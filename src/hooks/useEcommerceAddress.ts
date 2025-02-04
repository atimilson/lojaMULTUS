import { useGetApiEcommerceUsuarioEndereco, usePostApiEcommerceUsuarioEndereco, useDeleteApiEcommerceUsuarioEndereco, usePutApiEcommerceUsuarioEndereco } from '@/api/generated/mCNSistemas';
import { UsuarioEcommerceEnderecoIncluirDto, UsuarioEcommerceEnderecoDto } from '@/api/generated/mCNSistemas.schemas';
import { useAuth } from '@/contexts/AuthContext';

export function useEcommerceAddress() {

  const { data:UsuarioEcommerceEnderecoDto = [], isLoading, mutate } = useGetApiEcommerceUsuarioEndereco({
  });


  const addresses = Array.isArray(UsuarioEcommerceEnderecoDto) ? UsuarioEcommerceEnderecoDto : [];


  const { trigger: createAddress } = usePostApiEcommerceUsuarioEndereco();
  const { trigger: deleteAddress } = usePutApiEcommerceUsuarioEndereco();

  const addAddress = async (data: UsuarioEcommerceEnderecoIncluirDto) => {
    await createAddress(data);
    mutate();
  };


  const removeAddress = async (data: UsuarioEcommerceEnderecoIncluirDto) => {
    await deleteAddress( data );

    mutate();
  };

  return {
    addresses,
    isLoading,
    addAddress,
    removeAddress

  };
} 