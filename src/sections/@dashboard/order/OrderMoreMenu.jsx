import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

OrderMoreMenu.prototypes = {
  onViewClick: PropTypes.func,
  onDelete: PropTypes.func,
  onEditClick: PropTypes.func
};

export default function OrderMoreMenu(props) {
  const { onViewClick, onDelete, isRight, onRight, onEditClick, onImageClick } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {false && (
          <MenuItem
            sx={{ color: 'text.secondary' }}
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            <ListItemIcon>
              <Iconify icon="eva:trash-2-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {true && (
          <MenuItem
            component={RouterLink}
            to="#"
            sx={{ color: 'text.secondary' }}
            onClick={() => {
              onEditClick();
              setIsOpen(false);
            }}
          >
            <ListItemIcon>
              <Iconify icon="eva:edit-fill" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Change Status" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {isRight ? (
          <MenuItem
            sx={{ color: 'text.secondary' }}
            onClick={() => {
              onRight();
              setIsOpen(false);
            }}
          >
            <ListItemIcon>
              <Iconify icon="bx:copyright" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Rights" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ) : (
          ''
        )}
      </Menu>
    </>
  );
}
