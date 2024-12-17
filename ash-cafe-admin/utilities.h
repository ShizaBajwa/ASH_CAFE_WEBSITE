// File: utilities.h
// Purpose: Header file containing function declarations for weight conversion, random number generation, and array utilities.
// Author: Yousuf bin Masood
// Last Modified: November 9th, 2024 9:20 PM

#ifndef UTILITIES_H
#define UTILITIES_H

double pound2Kg(double pound);
void manyPound2Kg(double poundValues[], double kgValues[], int poundSize, int kgSize);
void printPound(double poundValues[], int size);
void printKg(double kgValues[], int size);
int getRandomIntRange(int min, int max);
double getRandomDoubleRange(double min, double max);
void fillArray(double data[], int size, double min, double max);

#endif