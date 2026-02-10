import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { AddExchangeRateForm } from './AddExchangeRateForm';

export const ExchangeRatesSettings = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Exchange Rates</CardTitle>
            <CardDescription>
              Manage exchange rates for currencies in your portfolio.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icons.PlusCircle className="mr-2 h-4 w-4" />
                Add rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <AddExchangeRateForm
                onSubmit={(newRate) => {
                  addExchangeRate(newRate);
                  setIsAddDialogOpen(false);
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  );
};
