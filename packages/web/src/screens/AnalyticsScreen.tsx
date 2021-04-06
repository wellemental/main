import React from 'react';
import {
  Container,
  FeaturedLoop,
  PageHeading,
  Subheadline,
  Page,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { AnalyticsServiceType, Week } from 'common';
import { useContainer, useQuery } from '../hooks';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const AnalyticsScreen: React.FC = () => {
  const classes = useStyles();

  const container = useContainer();
  const service = container.getInstance<AnalyticsServiceType>(
    'analyticsService',
  );

  const { data, error, loading } = useQuery<Week[]>(service.get);

  const columns = [
    // 'isoWeek',
    'startDate',
    'endDate',
    // 'signups',
    // 'activeSubs',
    // 'newSubs',
    // 'cancellations',
    'plays',
    'completions',
    // 'seconds',
    'favs',
  ];

  return (
    <>
      <PageHeading title="Analytics" />
      {/* <Subheadline>Stats</Subheadline> */}

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((key: string) => {
                return <TableCell>{key}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map(row => (
                <TableRow key={row.id}>
                  {columns.map((key: string) => {
                    // @ts-ignore
                    return !!row[key] ? (
                      <TableCell>
                        {
                          // @ts-ignore
                          typeof row[key] === 'string' ||
                          // @ts-ignore
                          typeof row[key] === 'number'
                            ? // @ts-ignore
                              row[key]
                            : // @ts-ignore
                              row[key].total
                        }
                      </TableCell>
                    ) : (
                      '--'
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AnalyticsScreen;
