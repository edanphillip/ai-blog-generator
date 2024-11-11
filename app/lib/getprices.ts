import { acceptedStreamModels } from '../types';
export type TokenShopParams = {
  model: acceptedStreamModels,
  service: "article" | "blogpostideas"
}
const getTokenShopPrice = ({ model, service }: TokenShopParams): number => {
  switch (service) {
    case 'article':
      if (model == 'gpt-3.5-turbo-0125') return 10
      if (model == 'gpt-4-1106-preview') return 200
      break;
    case 'blogpostideas':
      if (model == 'gpt-3.5-turbo-0125') return 1
      if (model == 'gpt-4-1106-preview') return 15
      break;
  }
  throw Error(`invalid model or service. Provided:${model}, ${service}`,)// shouldnt reach this point
}

export default getTokenShopPrice