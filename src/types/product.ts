export interface ProductImage {
  URL: string;
}

export interface Product {
  Produto: number;
  Preco: number;
  PrecoPromocional: number;
  Descricao: string;
  Estoque: number;
  Categoria: string;
  Marca: string;
  Grupo: string;
  SubGrupo: string;
  DescEcommerce: string;
  Observacao: string;
  Imagens: ProductImage[];
} 