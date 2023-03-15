import { Stack } from '@mui/material';
// Loader
import SyncLoader from 'react-spinners/SyncLoader';

export default function Loader(props) {
  const { isLoading } = props;

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <SyncLoader color="#00AB55" loading={isLoading} size={15} />
    </Stack>
  );
}
