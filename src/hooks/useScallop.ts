import { useQuery } from '@tanstack/react-query';
import { Scallop } from '@scallop-io/sui-scallop-sdk';

export const useScallopProtocolPkgId = () => {
  return useQuery({
    queryKey: ['scallop', 'mainnet', 'core.packages.protocol.id'],
    queryFn: async () => {
      const sdk = new Scallop({ networkType: 'mainnet' });
      const constants = await sdk.getScallopConstants();
      await constants.init({ force: true });
      const id = constants.get('core.packages.protocol.id') as
        | string
        | undefined;
      if (!id) throw new Error('Protocol package id not found');
      return id;
    },
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};
