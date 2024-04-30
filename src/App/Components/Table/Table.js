import {useCallback, useEffect, useRef, useState} from 'react'
import {useLocale} from '../Locale/LocaleHooks.js'
import Loader from '../Loader/Loader.js'

import {isCellSelected} from './TableHelpers.js'
import TableHeaderIcon from './TableHeaderIcon.js'
import TableCell from './TableCell.js'
import TableGroup from './TableGroup.js'

import ButtonIconTrash from '../Buttons/Icons/ButtonIconTrash.js'
import ButtonIconSquareCheck from '../Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconDownload from '../Buttons/Icons/ButtonIconDownload.js'
import ButtonIconPen from '../Buttons/Icons/ButtonIconPen.js'
import ButtonIconWave from '../Buttons/Icons/ButtonIconWave.js'

import styles from './Table.module.scss'

function Table({
                 className,
                 titleLeft,
                 titleRight,
                 data,
                 selectedData,
                 onSelect,
                 onSelectGroup,
                 onSelectAll,
                 onPlay,
                 onInfo,
                 onEdit,
                 onEditSelected,
                 onOptimizeAudio,
                 onOptimizeAudioSelected,
                 onDownload,
                 onDownloadSelected,
                 onDelete,
                 onDeleteSelected,
                 additionalHeaderButtons,
                 isLoading
               }) {

  const
    {getLocale} = useLocale(),
    [dataFiltered, setDataFiltered] = useState([]),
    searchInput = useRef(),
    onSearch = useCallback(
      () => {
        if (searchInput === null) {
          return
        }
        if (searchInput.current.value === '') {
          setDataFiltered(data)
          return
        }
        const regSearch = new RegExp('.*(' + searchInput.current.value.split(' ').join(').*(') + ').*', 'gi')
        setDataFiltered(
          data.reduce(
            (acc, d) => {
              if (d.tableGroup !== undefined) {
                const children = d.tableChildren.filter((d) => regSearch.test(d.cellTitle))
                if (children.length) {
                  return [
                    ...acc,
                    {
                      tableGroup: d.tableGroup,
                      tableChildren: children
                    }
                  ]
                }
              } else {
                if (regSearch.test(d.cellTitle)) {
                  return [...acc, d]
                }
              }
              return acc
            },
            []
          )
        )
      },
      [searchInput, data, setDataFiltered]
    )

  useEffect(() => onSearch(), [onSearch]);

  return <div className={[styles.tableContainer, className].join(' ')}>
    <div className={styles.header}>
      <h2 className={styles.headerTitleLeft}>{titleLeft}</h2>
      {titleRight && <p className={styles.headerTitleRight}>{titleRight}</p>}
      <input type="text"
             placeholder={getLocale('search') + '...'}
             ref={searchInput}
             className={styles.headerSearchInput}
             onKeyUp={onSearch}/>
      {
        (onSelectAll || onDeleteSelected || onDownloadSelected || onEditSelected || onOptimizeAudioSelected) &&
        <ul className={styles.headerIcons}>
          {
            onOptimizeAudioSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconWave}
                             title="telmios-optimize-audio"
                             onClick={onOptimizeAudioSelected}/>
          }
          {
            onEditSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconPen}
                             title="edit-selected"
                             onClick={onEditSelected}/>
          }
          {
            onDownloadSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconDownload}
                             title="download-selected"
                             onClick={onDownloadSelected}/>
          }
          {
            onDeleteSelected && selectedData.length > 0 &&
            <TableHeaderIcon componentIcon={ButtonIconTrash}
                             title="delete-selected"
                             onClick={onDeleteSelected}/>
          }
          {
            onSelectAll &&
            <TableHeaderIcon componentIcon={ButtonIconSquareCheck}
                             title="select-all"
                             onClick={onSelectAll}/>
          }
          {additionalHeaderButtons || null}
        </ul>
      }

    </div>
    <div className={styles.content}>
      <div className={styles.contentScroller}>
        <ul className={styles.cells}>{
          dataFiltered.map((v, k) => {
            if (v.tableGroup !== undefined) {
              return <TableGroup key={'cell-' + k}
                                 data={v}
                                 selectedData={selectedData}
                                 onSelect={onSelect}
                                 onSelectGroup={onSelectGroup}
                                 onPlay={onPlay}
                                 onOptimizeAudio={onOptimizeAudio}
                                 onEdit={onEdit}
                                 onInfo={onInfo}
                                 onDownload={onDownload}
                                 onDelete={onDelete}/>
            } else {
              return <TableCell key={'cell-' + k}
                                data={v}
                                selected={isCellSelected(selectedData, v)}
                                onSelect={onSelect}
                                onPlay={onPlay}
                                onOptimizeAudio={onOptimizeAudio}
                                onEdit={onEdit}
                                onInfo={onInfo}
                                onDownload={onDownload}
                                onDelete={onDelete}/>
            }
          })
        }</ul>
      </div>
    </div>
    {isLoading && <Loader/>}
  </div>

}

export default Table
