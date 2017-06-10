import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { LinkButton } from 'components'
import ContextMenu from 'main/lib/ContextMenu'
import dataAPI from 'main/lib/dataAPI'
import { routerShape } from 'react-router'

const DEFAULT_FOLDER_NAME = 'Notes'

const Root = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
`

const Button = styled(LinkButton)`
  display: flex;
  width: 100%;
  height: 24px;
  line-height: 24px;
  margin: 0;
  padding: 0 10px;
  background-color: ${p => p.theme.buttonBackgroundColor};
  border: none;
  outline: none;
  cursor: pointer;
  color: ${p => p.theme.color};
  text-decoration: none;
  text-align: left;
  font-size: 12px;
  &:hover {
    background-color: ${p => p.theme.buttonHoverColor};
  }
  &:active {
    background-color: ${p => p.theme.buttonActiveColor};
  }
  &.active {
    font-weight: bold;
    background-color: ${p => p.isFocused
      ? p.theme.activeColor
      : p.theme.buttonActiveColor};
    color: ${p => p.isFocused
      ? p.theme.activeInverseColor
      : p.theme.color};
    .count {
      color: inherit;
    }
  }
  .label {
    flex: 1;
  }
  .count {
    font-size: 10px;
    color: ${p => p.theme.inactiveColor};
  }
`

const RenameInput = styled.input`
  ${p => p.theme.input}
  height: 20px;
  line-height: 20px;
  padding: 0 5px;
  display: block;
  width: 100%;
  margin: 0 10px;
  box-sizing: border-box;
  flex: 1;
`

class FolderButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isRenaming: false,
      newName: props.folderName,
      isDragEntered: false
    }

    this.handleContextMenu = e => {
      const { folderName } = this.props

      const isDefaultFolder = folderName === DEFAULT_FOLDER_NAME

      ContextMenu.open([
        {
          label: 'Rename Folder...',
          click: e => this.rename(),
          enabled: !isDefaultFolder
        },
        {
          label: 'Delete Folder...',
          click: e => this.delete(),
          enabled: !isDefaultFolder
        },
        // {
        //   label: 'New Sub Folder...'
        // },
        {
          type: 'separator'
        },
        {
          label: 'New Folder...',
          click: e => this.props.createNewButton()
        }
      ])
    }

    this.handleInputBlur = e => {
      this.confirmRenaming()
    }

    this.handleInputKeyDown = e => {
      e.stopPropagation()

      switch (e.keyCode) {
        case 13:
          this.confirmRenaming()
          break
        case 27:
          this.cancelRenaming()
          break
      }
    }

    this.handleInputChange = e => {
      this.setState({
        newName: this.input.value
      })
    }
  }

  handleDragEnter = e => {
    this.setState({
      isDragEntered: true
    })
  }

  handleDragLeave = e => {
    this.setState({
      isDragEntered: false
    })
  }

  handleDrop = e => {
    const data = JSON.parse(e.dataTransfer.getData('application/json'))

    this.setState({
      isDragEntered: false
    }, () => {
      this.parseDropData(data)
    })
  }

  parseDropData (data) {
    const { storageName, folderName } = this.props
    const { store } = this.context

    switch (data.type) {
      case 'MOVE_NOTE':
        const noteId = data.payload.noteKey

        dataAPI
          .updateNote(storageName, noteId, {folder: folderName})
          .then(res => {
            store.dispatch({
              type: 'UPDATE_NOTE',
              payload: {
                storageName,
                noteId: res.id,
                note: res.note
              }
            })
          })
    }
  }

  rename () {
    this.setState({
      isRenaming: true,
      newName: this.props.folderName
    }, () => {
      this.input.focus()
      this.input.select()
    })
  }

  delete () {
    const { storageName, folderName, deleteFolder } = this.props
    deleteFolder(storageName, folderName)
  }

  cancelRenaming () {
    this.setState({
      isRenaming: false
    }, () => {
      this.button.focus()
    })
  }

  confirmRenaming () {
    this.setState({
      isRenaming: false
    }, () => {
      const { storageName, resolveNewName, folderName } = this.props
      const { store, router } = this.context

      const newFolderName = resolveNewName(this.state.newName)

      dataAPI
        .renameFolder(storageName, folderName, newFolderName)
        .then(res => {
          if (router.params.folderName === folderName) {
            router.push(`/storages/${storageName}/folders/${newFolderName}`)
          }
          store.dispatch({
            type: 'MOVE_FOLDER',
            payload: {
              storageName,
              folderName,
              newFolderName
            }
          })
        })
    })
  }

  render () {
    const { folderURL, folderName, folderMeta, isFocused } = this.props

    return (
      <Root
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {this.state.isRenaming
          ? <RenameInput
            innerRef={c => (this.input = c)}
            value={this.state.newName}
            onBlur={this.handleInputBlur}
            onKeyDown={this.handleInputKeyDown}
            onChange={this.handleInputChange}
          />
          : <Button
            to={folderURL}
            innerRef={c => (this.button = c)}
            onContextMenu={this.handleContextMenu}
            className={this.state.isDragEntered
              ? 'NavButton active'
              : 'NavButton'
            }
            isFocused={isFocused}
          >
            <span className='label'>{folderName}</span>
            <span className='count'>{folderMeta.get('notes').size}</span>
          </Button>
        }
      </Root>
    )
  }
}

FolderButton.propTypes = {
  folderURL: PropTypes.string,
  folderName: PropTypes.string,
  storageName: PropTypes.string,
  resolveNewName: PropTypes.func,
  deleteFolder: PropTypes.func
}

FolderButton.contextTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func
  }),
  router: routerShape
}

export default FolderButton
