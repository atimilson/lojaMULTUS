export interface ProductImage {
  URL: string;
}

export interface Product {
  Contrato?: number;
  Produto: number;
  Preco: number;
  PrecoPromocional: number;
  Descricao: string;
  Estoque: number;
  Categoria: string;
  DescCategoria?: string;
  Marca: string;
  DescMarca?: string;
  Complemento?: string;
  Grupo: string;
  SubGrupo: string;
  DescEcommerce: string;
  Observacao: string;
  Imagens: ProductImage[];
  Alteracao: string;
} 