import React, { useState, useEffect } from "react";
import { CompaniesCard, CompaniesData } from "./CompaniesCard";
import { Plus } from "lucide-react";
import { companyService } from "../../services/companyService";
import { Button } from "../../components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { CompanyModal } from "./CompanyModal";

export const Companies: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  // debounce input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 650);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // useQuery / useSuspenseQuery + Suspense (for query what is surely always defined and NO undefined data will be returned) / useQueries({queries: []}) --- returns us a bunch of stuff, the main is data we want to work on, as well as boolean helpers; error; enabled (with enabled:no and state on, setOn)
  const { data, isLoading } = useQuery<CompaniesData>({
    queryKey: ["companies", page, search, sortBy, sortOrder, statusFilter], // query keys array allows us to cache things we assigned keys to, like page, search and other states from useState up there, so it will not be refetched again in case of new request
    queryFn: () =>
      companyService.getCompanies({
        page,
        limit: 5, // set to 5 on each page
        search,
        sortBy,
        sortOrder,
        status: statusFilter,
      }),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-gray-400 mt-1">Manage your company portfolio</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Company
        </Button>
      </div>
      <CompanyModal open={showModal} onClose={() => setShowModal(false)} />
      <CompaniesCard
        data={data}
        isLoading={isLoading}
        searchInput={searchInput}
        handleSearch={handleSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};
