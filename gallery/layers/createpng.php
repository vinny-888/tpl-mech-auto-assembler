#!/usr/bin/php -q
<?php

  $dh = opendir('../svg-unbound');
  while (($fname = readdir($dh)) !== false) {
    $fname = trim($fname);
    if ($fname == '.' || $fname == '..') { continue; }
    if (! preg_match('/\.svg$/',$fname)) { continue; }

    $from = '../svg-unbound/' . $fname;
    $to = preg_replace('/svg$/','png',$fname);

    $cmd = "rsvg-convert $from -o $to";
    $ret = shell_exec($cmd);

    print ".";
  }

  print "\n";

?>
